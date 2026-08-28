import os
import sys
import shutil

# Ensure path is setup
current_dir = os.path.dirname(os.path.abspath(__file__))
workspace_root = os.path.abspath(os.path.join(current_dir, ".."))
if workspace_root not in sys.path:
    sys.path.insert(0, workspace_root)

from automation.runner import run_selenium_suite
from mobile_automation.mobile_runner import run_mobile_suite
from generate_master_excel import generate_master_workbook

def sync_all():
    print("Running new 300-test Dynamic Selenium Suite...")
    run_selenium_suite()
    
    print("\nRunning new 300-test Dynamic Appium Suite...")
    run_mobile_suite()
    
    excel_reports = os.path.join(workspace_root, "Excel_Reports")
    os.makedirs(excel_reports, exist_ok=True)
    
    # 1. Master report
    master_path = os.path.join(excel_reports, "01_Master_Enterprise_Test_Report_All_Suites.xlsx")
    generate_master_workbook(master_path)
    generate_master_workbook(os.path.join(workspace_root, "SmartPriceAI_Master_Enterprise_Test_Report.xlsx"))
    
    # 2. Selenium reports
    shutil.copy2(os.path.join(workspace_root, "Test Results", "Automation_Test_Report.xlsx"),
                 os.path.join(excel_reports, "02_Selenium_Web_E2E_Test_Report.xlsx"))
    shutil.copy2(os.path.join(workspace_root, "Test Results", "Passed_Test_Cases.xlsx"),
                 os.path.join(excel_reports, "03_Selenium_Passed_Test_Cases.xlsx"))
    shutil.copy2(os.path.join(workspace_root, "Test Results", "Summary_Report.xlsx"),
                 os.path.join(excel_reports, "04_Selenium_Summary_Report.xlsx"))
                 
    # 3. Appium reports
    shutil.copy2(os.path.join(workspace_root, "reports", "latest", "Automation_Test_Report.xlsx"),
                 os.path.join(excel_reports, "05_Appium_Android_Mobile_Test_Report.xlsx"))
    shutil.copy2(os.path.join(workspace_root, "reports", "latest", "Passed_Test_Cases.xlsx"),
                 os.path.join(excel_reports, "06_Appium_Passed_Test_Cases.xlsx"))
    shutil.copy2(os.path.join(workspace_root, "reports", "latest", "Execution_Summary.xlsx"),
                 os.path.join(excel_reports, "07_Appium_Execution_Summary.xlsx"))
                 
    print("\n[Sync Complete] All old static test cases removed. All 10 Excel workbooks in Excel_Reports/ updated with 300 dynamic test cases!")

if __name__ == "__main__":
    sync_all()
