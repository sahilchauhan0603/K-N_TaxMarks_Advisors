#!/bin/bash

# Script to update all service forms to use the new pricing system

# List of files to update
FILES=(
    "c:/SAHIL/VS_Code/PROJECTS/K-N_TaxMarks_Advisors/client/src/pages/services/TaxPlanning/TaxPlanningComplianceForm.jsx"
    "c:/SAHIL/VS_Code/PROJECTS/K-N_TaxMarks_Advisors/client/src/pages/services/TradeMark/TrademarkDocumentationForm.jsx"
    "c:/SAHIL/VS_Code/PROJECTS/K-N_TaxMarks_Advisors/client/src/pages/services/ITRFiling/ITRDocumentPrepForm.jsx"
    "c:/SAHIL/VS_Code/PROJECTS/K-N_TaxMarks_Advisors/client/src/pages/services/BusinessAdvisory/BusinessAdvisoryAdvisoryForm.jsx"
    "c:/SAHIL/VS_Code/PROJECTS/K-N_TaxMarks_Advisors/client/src/pages/services/TradeMark/TrademarkProtectionForm.jsx"
    "c:/SAHIL/VS_Code/PROJECTS/K-N_TaxMarks_Advisors/client/src/pages/services/BusinessAdvisory/BusinessAdvisoryIncorporationForm.jsx"
    "c:/SAHIL/VS_Code/PROJECTS/K-N_TaxMarks_Advisors/client/src/pages/services/TaxPlanning/TaxPlanningPersonalCorporateForm.jsx"
    "c:/SAHIL/VS_Code/PROJECTS/K-N_TaxMarks_Advisors/client/src/pages/services/ITRFiling/ITRFilingForm.jsx"
    "c:/SAHIL/VS_Code/PROJECTS/K-N_TaxMarks_Advisors/client/src/pages/services/GSTFiling/GSTResolutionForm.jsx"
    "c:/SAHIL/VS_Code/PROJECTS/K-N_TaxMarks_Advisors/client/src/pages/services/TradeMark/TrademarkSearchForm.jsx"
    "c:/SAHIL/VS_Code/PROJECTS/K-N_TaxMarks_Advisors/client/src/pages/services/TaxPlanning/TaxPlanningYearRoundForm.jsx"
    "c:/SAHIL/VS_Code/PROJECTS/K-N_TaxMarks_Advisors/client/src/pages/services/ITRFiling/ITRRefundNoticeForm.jsx"
    "c:/SAHIL/VS_Code/PROJECTS/K-N_TaxMarks_Advisors/client/src/pages/services/BusinessAdvisory/BusinessAdvisoryStartupForm.jsx"
)

# Service type mappings
declare -A SERVICE_MAPPINGS=(
    ["TaxPlanningComplianceForm.jsx"]="tax compliance"
    ["TrademarkDocumentationForm.jsx"]="trademark documentation"  
    ["ITRDocumentPrepForm.jsx"]="itr document_prep"
    ["BusinessAdvisoryAdvisoryForm.jsx"]="business advisory"
    ["TrademarkProtectionForm.jsx"]="trademark protection"
    ["BusinessAdvisoryIncorporationForm.jsx"]="business incorporation"
    ["TaxPlanningPersonalCorporateForm.jsx"]="tax personal_corporate"
    ["ITRFilingForm.jsx"]="itr filing_individual"
    ["GSTResolutionForm.jsx"]="gst resolution"
    ["TrademarkSearchForm.jsx"]="trademark search"
    ["TaxPlanningYearRoundForm.jsx"]="tax year_round"
    ["ITRRefundNoticeForm.jsx"]="itr refund_notice"
    ["BusinessAdvisoryStartupForm.jsx"]="business startup"
)

echo "Service Form Pricing Update Guide"
echo "================================="
echo ""
echo "The following files need to be updated to use the new pricing system:"
echo ""

for file in "${FILES[@]}"; do
    filename=$(basename "$file")
    echo "File: $filename"
    echo "Service: ${SERVICE_MAPPINGS[$filename]}"
    echo "Path: $file"
    echo ""
done

echo "Update Instructions:"
echo "1. Change import: getServicePrice, formatPrice → useServicePrice"
echo "2. Replace pricing logic with: const { price, loading: priceLoading, formattedPrice } = useServicePrice(category, type);"
echo "3. Update display to show loading state"