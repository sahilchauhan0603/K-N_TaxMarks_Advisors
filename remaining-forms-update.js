// Script to update remaining service forms with new pricing system

const forms = [
  {
    path: 'c:/SAHIL/VS_Code/PROJECTS/K-N_TaxMarks_Advisors/client/src/pages/services/TradeMark/TrademarkProtectionForm.jsx',
    category: 'trademark',
    serviceType: 'protection'
  },
  {
    path: 'c:/SAHIL/VS_Code/PROJECTS/K-N_TaxMarks_Advisors/client/src/pages/services/TradeMark/TrademarkDocumentationForm.jsx',
    category: 'trademark', 
    serviceType: 'documentation'
  },
  {
    path: 'c:/SAHIL/VS_Code/PROJECTS/K-N_TaxMarks_Advisors/client/src/pages/services/BusinessAdvisory/BusinessAdvisoryStartupForm.jsx',
    category: 'business',
    serviceType: 'startup'
  },
  {
    path: 'c:/SAHIL/VS_Code/PROJECTS/K-N_TaxMarks_Advisors/client/src/pages/services/BusinessAdvisory/BusinessAdvisoryIncorporationForm.jsx',
    category: 'business',
    serviceType: 'incorporation'
  },
  {
    path: 'c:/SAHIL/VS_Code/PROJECTS/K-N_TaxMarks_Advisors/client/src/pages/services/BusinessAdvisory/BusinessAdvisoryAdvisoryForm.jsx',
    category: 'business',
    serviceType: 'advisory'
  },
  {
    path: 'c:/SAHIL/VS_Code/PROJECTS/K-N_TaxMarks_Advisors/client/src/pages/services/TaxPlanning/TaxPlanningYearRoundForm.jsx',
    category: 'tax',
    serviceType: 'year_round'
  },
  {
    path: 'c:/SAHIL/VS_Code/PROJECTS/K-N_TaxMarks_Advisors/client/src/pages/services/TaxPlanning/TaxPlanningPersonalCorporateForm.jsx',
    category: 'tax',
    serviceType: 'personal_corporate'
  },
  {
    path: 'c:/SAHIL/VS_Code/PROJECTS/K-N_TaxMarks_Advisors/client/src/pages/services/TaxPlanning/TaxPlanningComplianceForm.jsx',
    category: 'tax',
    serviceType: 'compliance'
  }
];

console.log('Forms to update:', forms.length);
console.log('Update pattern for each form:');
console.log('1. Import: getServicePrice, formatPrice → useServicePrice');
console.log('2. Replace pricing logic with useServicePrice hook');
console.log('3. Add loading state to price display');

forms.forEach((form, index) => {
  console.log(`\n${index + 1}. ${form.path.split('/').pop()}`);
  console.log(`   Category: ${form.category}`);
  console.log(`   Service Type: ${form.serviceType}`);
  console.log(`   Hook: useServicePrice('${form.category}', '${form.serviceType}')`);
});

export { forms };