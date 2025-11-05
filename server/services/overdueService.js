const Bill = require('../models/Bill');
const User = require('../models/User');
const sendMail = require('../utils/mailer');

class OverdueService {
  constructor() {
    this.isRunning = false;
  }

  // Calculate penalty amount for overdue bills
  calculatePenalty(originalAmount, overdueDays, penaltyRate = 0.05) {
    // Calculate penalty based on days overdue
    // For each week overdue, add penaltyRate percentage
    const weeksOverdue = Math.ceil(overdueDays / 7);
    const penaltyMultiplier = weeksOverdue * penaltyRate;
    return Math.round(originalAmount * penaltyMultiplier);
  }

  // Process overdue bills - update amounts and send notifications
  async processOverdueBills() {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    const now = new Date();
    
    try {
      // 1. Check bills that are due tomorrow and send pre-due reminder
      await this.sendPreDueReminders();

      // 2. Update pending bills to overdue status
      await this.updateOverdueBills();

      // 3. Update penalty amounts for overdue bills
      await this.updatePenaltyAmounts();

      // 4. Send overdue reminders
      await this.sendOverdueReminders();
    } catch (error) {
      console.error('Error processing overdue bills:', error);
    } finally {
      this.isRunning = false;
    }
  }

  // Send reminder to users whose bills are due tomorrow
  async sendPreDueReminders() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

    const billsDueTomorrow = await Bill.find({
      status: 'Pending',
      dueDate: {
        $gte: tomorrow,
        $lt: dayAfterTomorrow
      },
      $or: [
        { lastReminderSent: null },
        { lastReminderSent: { $lt: tomorrow } }
      ]
    }).populate('userId', 'name email');

    for (const bill of billsDueTomorrow) {
      try {
        await this.sendPreDueReminderEmail(bill);
        
        // Update reminder tracking
        bill.lastReminderSent = new Date();
        bill.reminderCount = (bill.reminderCount || 0) + 1;
        await bill.save();
      } catch (error) {
        console.error(`Failed to send pre-due reminder for bill ${bill.billNumber}:`, error);
      }
    }
  }

  // Update pending bills to overdue status
  async updateOverdueBills() {
    const now = new Date();
    
    // First get all bills that will become overdue
    const billsToUpdate = await Bill.find({
      status: 'Pending',
      dueDate: { $lt: now }
    });

    // Update each bill individually to ensure originalAmount is set correctly
    for (const bill of billsToUpdate) {
      bill.status = 'Overdue';
      bill.overdueSince = now;
      
      // Set originalAmount if it doesn't exist
      if (!bill.originalAmount || bill.originalAmount === 0) {
        bill.originalAmount = bill.amount;
      }
      
      bill.updatedAt = now;
      await bill.save();
    }
  }

  // Update penalty amounts for overdue bills
  async updatePenaltyAmounts() {
    const overdueBills = await Bill.find({
      status: 'Overdue',
      overdueSince: { $exists: true }
    });

    for (const bill of overdueBills) {
      try {
        // Skip if originalAmount is not properly set
        if (!bill.originalAmount || bill.originalAmount === 0) {
          continue;
        }
        
        const now = new Date();
        let overdueDays = 0;
        
        try {
          if (bill.overdueSince) {
            const overdueDate = new Date(bill.overdueSince);
            if (!isNaN(overdueDate.getTime())) {
              overdueDays = Math.floor((now - overdueDate) / (1000 * 60 * 60 * 24));
            }
          }
          
          // Fallback to dueDate if overdueSince calculation failed
          if (overdueDays <= 0 && bill.dueDate) {
            const dueDate = new Date(bill.dueDate);
            if (!isNaN(dueDate.getTime())) {
              overdueDays = Math.floor((now - dueDate) / (1000 * 60 * 60 * 24));
            }
          }
          
          // Ensure overdue days is positive and reasonable (max 365 days)
          const originalOverdueDays = overdueDays;
          overdueDays = Math.max(1, Math.min(overdueDays, 365));
          
          if (originalOverdueDays > 365 || originalOverdueDays < 0) {
            console.log(`Fixed invalid overdue days for ${bill.billNumber}: from ${originalOverdueDays} to ${overdueDays}`);
          }
          
        } catch (error) {
          console.error(`Error calculating overdue days for bill ${bill.billNumber}:`, error);
          overdueDays = 1; // Default to 1 day if calculation fails
        }
        
        // CRITICAL: Always use the stored originalAmount, never calculate from current amount
        const originalAmount = bill.originalAmount;
        const penaltyAmount = this.calculatePenalty(originalAmount, overdueDays, bill.penaltyRate);
        const totalAmount = originalAmount + penaltyAmount;

        if (bill.penaltyAmount !== penaltyAmount || bill.amount !== totalAmount) {
          bill.penaltyAmount = penaltyAmount;
          bill.amount = totalAmount;
          bill.updatedAt = new Date();
          await bill.save();
        }
      } catch (error) {
        console.error(`Failed to update penalty for bill ${bill.billNumber}:`, error);
      }
    }
  }

  // Send overdue reminders every 2 days
  async sendOverdueReminders() {
    const now = new Date();
    const twoDaysAgo = new Date(now.getTime() - (2 * 24 * 60 * 60 * 1000));

    const overdueBillsForReminder = await Bill.find({
      status: 'Overdue',
      $or: [
        { lastReminderSent: null },
        { lastReminderSent: { $lt: twoDaysAgo } }
      ]
    }).populate('userId', 'name email');

    for (const bill of overdueBillsForReminder) {
      try {
        await this.sendOverdueReminderEmail(bill);
        
        // Update reminder tracking
        bill.lastReminderSent = new Date();
        bill.reminderCount = (bill.reminderCount || 0) + 1;
        await bill.save();
      } catch (error) {
        console.error(`Failed to send overdue reminder for bill ${bill.billNumber}:`, error);
      }
    }
  }

  // Send pre-due reminder email
  async sendPreDueReminderEmail(bill) {
    
    await sendMail(
      bill.userId.email,
      'Payment Reminder - Bill Due Tomorrow',
      undefined,
      `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f6f8fa; padding: 32px 0;">
          <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 18px; box-shadow: 0 2px 12px #0001; padding: 32px 28px; border: 1px solid #e5e7eb;">
            <div style="text-align: center; margin-bottom: 24px;">
              <div style="display: inline-block; background: linear-gradient(90deg,#f59e0b,#d97706); border-radius: 50%; padding: 16px; margin-bottom: 16px;">
                <span style="font-size: 2rem;">⏰</span>
              </div>
              <h2 style="font-size: 1.8rem; font-weight: 700; color: #1e293b; margin: 0;">Payment Due Tomorrow</h2>
              <p style="color: #64748b; font-size: 1rem; margin: 8px 0 0 0;">Dear ${bill.userId.name}, your bill payment is due tomorrow.</p>
            </div>
            
            <div style="background: #fff7ed; border: 1px solid #fb923c; border-radius: 12px; padding: 20px; margin: 24px 0;">
              <h3 style="margin: 0 0 12px 0; color: #ea580c;">📋 Bill Details:</h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <div>
                  <p style="margin: 4px 0; color: #9a3412; font-size: 0.9rem;">Bill Number:</p>
                  <p style="margin: 4px 0; font-weight: 600;">${bill.billNumber}</p>
                </div>
                <div>
                  <p style="margin: 4px 0; color: #9a3412; font-size: 0.9rem;">Amount Due:</p>
                  <p style="margin: 4px 0; font-weight: 600; color: #ea580c;">₹${bill.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p style="margin: 4px 0; color: #9a3412; font-size: 0.9rem;">Due Date:</p>
                  <p style="margin: 4px 0; font-weight: 600;">${bill.dueDate.toLocaleDateString('en-IN')}</p>
                </div>
                <div>
                  <p style="margin: 4px 0; color: #9a3412; font-size: 0.9rem;">Service:</p>
                  <p style="margin: 4px 0; font-weight: 600;">${bill.serviceName}</p>
                </div>
              </div>
            </div>

            <div style="background: #fef3c7; border: 1px solid #f59e0b; border-radius: 12px; padding: 16px; margin: 24px 0;">
              <p style="margin: 0; color: #92400e; font-weight: 600;">⚠️ Important Notice</p>
              <p style="margin: 8px 0 0 0; color: #92400e; font-size: 0.9rem;">Please make your payment by tomorrow to avoid penalty charges. After the due date, a ${(bill.penaltyRate * 100)}% penalty will be applied weekly.</p>
            </div>

            <div style="text-align: center; margin: 32px 0;">
              <a href="${process.env.FRONTEND_URL || 'https://kandn-taxmarks-advisors.onrender.com/'}/profile/bills?highlight=${bill._id}" 
                 style="display: inline-block; background: linear-gradient(90deg,#10b981,#059669); color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 1.1rem;">
                💳 Pay Now
              </a>
            </div>

            <p style="color: #64748b; font-size: 0.9rem; text-align: center; margin-bottom: 0;">If you have already made the payment, please ignore this reminder. For any queries, contact our support team.</p>
            <div style="margin-top: 32px; text-align: center; color: #94a3b8; font-size: 0.9rem;">&copy; ${new Date().getFullYear()} K-N TaxMarks Advisors</div>
          </div>
        </div>
      `
    );
  }

  // Send overdue reminder email
  async sendOverdueReminderEmail(bill) {
    const now = new Date();
    let overdueDays = 0;
    
    try {
      if (bill.overdueSince) {
        const overdueDate = new Date(bill.overdueSince);
        // Validate that overdueDate is a valid date
        if (!isNaN(overdueDate.getTime())) {
          overdueDays = Math.floor((now - overdueDate) / (1000 * 60 * 60 * 24));
          console.log(`Overdue calculation for ${bill.billNumber}: overdueSince=${bill.overdueSince}, calculated days=${overdueDays}`);
        }
      }
      
      // Fallback to dueDate if overdueSince calculation failed or doesn't exist
      if (overdueDays <= 0 && bill.dueDate) {
        const dueDate = new Date(bill.dueDate);
        if (!isNaN(dueDate.getTime())) {
          overdueDays = Math.floor((now - dueDate) / (1000 * 60 * 60 * 24));
          console.log(`Overdue calculation for ${bill.billNumber}: dueDate=${bill.dueDate}, calculated days=${overdueDays}`);
        }
      }
      
      // Ensure overdue days is positive and reasonable (max 365 days)
      const originalOverdueDays = overdueDays;
      overdueDays = Math.max(1, Math.min(overdueDays, 365));
      
      if (originalOverdueDays !== overdueDays) {
        console.log(`Adjusted overdue days for ${bill.billNumber}: from ${originalOverdueDays} to ${overdueDays}`);
      }
      
    } catch (error) {
      console.error(`Error calculating overdue days for bill ${bill.billNumber}:`, error);
      overdueDays = 1; // Default to 1 day if calculation fails
    }
    
    const originalAmount = bill.originalAmount || bill.amount;
    
    await sendMail(
      bill.userId.email,
      `Payment Overdue - Action Required (${overdueDays} days)`,
      undefined,
      `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f6f8fa; padding: 32px 0;">
          <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 18px; box-shadow: 0 2px 12px #0001; padding: 32px 28px; border: 1px solid #e5e7eb;">
            <div style="text-align: center; margin-bottom: 24px;">
              <div style="display: inline-block; background: linear-gradient(90deg,#ef4444,#dc2626); border-radius: 50%; padding: 16px; margin-bottom: 16px;">
                <span style="font-size: 2rem;">🚨</span>
              </div>
              <h2 style="font-size: 1.8rem; font-weight: 700; color: #1e293b; margin: 0;">Payment Overdue - ${overdueDays} Days</h2>
              <p style="color: #64748b; font-size: 1rem; margin: 8px 0 0 0;">Dear ${bill.userId.name}, your bill payment is overdue and penalty charges have been applied.</p>
            </div>
            
            <div style="background: #fef2f2; border: 1px solid #f87171; border-radius: 12px; padding: 20px; margin: 24px 0;">
              <h3 style="margin: 0 0 12px 0; color: #dc2626;">📋 Overdue Bill Details:</h3>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <div>
                  <p style="margin: 4px 0; color: #991b1b; font-size: 0.9rem;">Bill Number:</p>
                  <p style="margin: 4px 0; font-weight: 600;">${bill.billNumber}</p>
                </div>
                <div>
                  <p style="margin: 4px 0; color: #991b1b; font-size: 0.9rem;">Service:</p>
                  <p style="margin: 4px 0; font-weight: 600;">${bill.serviceName}</p>
                </div>
                <div>
                  <p style="margin: 4px 0; color: #991b1b; font-size: 0.9rem;">Original Amount:</p>
                  <p style="margin: 4px 0; font-weight: 600;">₹${originalAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p style="margin: 4px 0; color: #991b1b; font-size: 0.9rem;">Penalty Amount:</p>
                  <p style="margin: 4px 0; font-weight: 600; color: #dc2626;">₹${bill.penaltyAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p style="margin: 4px 0; color: #991b1b; font-size: 0.9rem;">Total Amount Due:</p>
                  <p style="margin: 4px 0; font-weight: 700; color: #dc2626; font-size: 1.2rem;">₹${bill.amount.toLocaleString()}</p>
                </div>
                <div>
                  <p style="margin: 4px 0; color: #991b1b; font-size: 0.9rem;">Days Overdue:</p>
                  <p style="margin: 4px 0; font-weight: 600; color: #dc2626;">${overdueDays} days</p>
                </div>
              </div>
            </div>

            <div style="background: #fee2e2; border: 1px solid #ef4444; border-radius: 12px; padding: 16px; margin: 24px 0;">
              <p style="margin: 0; color: #991b1b; font-weight: 600;">⚠️ Penalty Applied</p>
              <p style="margin: 8px 0 0 0; color: #991b1b; font-size: 0.9rem;">A penalty of ₹${bill.penaltyAmount.toLocaleString()} has been added to your original bill amount. The penalty increases weekly at a rate of ${(bill.penaltyRate * 100)}%.</p>
            </div>

            <div style="text-align: center; margin: 32px 0;">
              <a href="${process.env.FRONTEND_URL || 'https://kandn-taxmarks-advisors.onrender.com'}/profile/bills?highlight=${bill._id}" 
                 style="display: inline-block; background: linear-gradient(90deg,#ef4444,#dc2626); color: white; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: 600; font-size: 1.1rem;">
                💳 Pay Now - ₹${bill.amount.toLocaleString()}
              </a>
            </div>

            <div style="background: #f3f4f6; border-radius: 12px; padding: 16px; margin: 24px 0;">
              <p style="margin: 0; color: #374151; font-weight: 600;">💡 To avoid further penalties:</p>
              <ul style="margin: 8px 0 0 0; padding-left: 20px; color: #374151; font-size: 0.9rem;">
                <li>Pay immediately to prevent additional charges</li>
                <li>Contact us if you're facing payment difficulties</li>
                <li>Set up automatic payments for future bills</li>
              </ul>
            </div>

            <p style="color: #64748b; font-size: 0.9rem; text-align: center; margin-bottom: 0;">This is reminder #${bill.reminderCount || 1}. For payment assistance or queries, contact our support team immediately.</p>
            <div style="margin-top: 32px; text-align: center; color: #94a3b8; font-size: 0.9rem;">&copy; ${new Date().getFullYear()} K-N TaxMarks Advisors</div>
          </div>
        </div>
      `
    );
  }

  // Start the periodic checker (run every 4 hours)
  startPeriodicCheck() {
    // Run immediately
    this.processOverdueBills();
    
    // Then run every 4 hours
    setInterval(() => {
      this.processOverdueBills();
    }, 4 * 60 * 60 * 1000); // 4 hours in milliseconds
  }
}

module.exports = new OverdueService();