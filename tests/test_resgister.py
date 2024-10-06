import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

class TestRegisterPage(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        chrome_options = Options()
        # Uncomment if you want to run tests in headless mode
        # chrome_options.headless = True
        chrome_service = Service('/usr/bin/chromedriver') 
        cls.driver = webdriver.Chrome(service=chrome_service, options=chrome_options)
        cls.driver.maximize_window()
        cls.driver.implicitly_wait(10)
        cls.base_url = "http://localhost:6014/register"  

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

    def test_register_with_valid_data(self):
        """Test registration with valid data."""
        self.driver.get(self.base_url)
        self.driver.find_element(By.NAME, "first_name").send_keys("John")
        self.driver.find_element(By.NAME, "last_name").send_keys("Doe")
        self.driver.find_element(By.NAME, "email").send_keys("johndoe@example.com")
        self.driver.find_element(By.NAME, "password").send_keys("validpassword")
        self.driver.find_element(By.TAG_NAME, "form").submit()
        time.sleep(2)
        self.driver.get("http://localhost:6014/login")
        self.driver.find_element(By.NAME, "email").send_keys("johndoe@example.com")
        self.driver.find_element(By.NAME, "password").send_keys("validpassword")
        self.driver.find_element(By.TAG_NAME, "form").submit()
        WebDriverWait(self.driver, 10).until(EC.url_contains("/manage-course"))  
        self.assertIn("/manage-course", self.driver.current_url)  

    def test_register_with_missing_fields(self):
        """Test registration with missing fields to check validation."""
        self.driver.get(self.base_url)
        self.driver.find_element(By.NAME, "first_name").send_keys("John")
        self.driver.find_element(By.NAME, "last_name").send_keys("Doe")
        form = self.driver.find_element(By.TAG_NAME, "form")
        form_valid = self.driver.execute_script("return arguments[0].checkValidity();", form)
        self.assertFalse(form_valid)
        self.assertIn(self.base_url, self.driver.current_url)

    def test_navigation_to_login_page(self):
        """Test clicking the 'Sign in' link to navigate to the login page."""
        self.driver.get(self.base_url)
        sign_in_link = self.driver.find_element(By.LINK_TEXT, "Sign in")
        sign_in_link.click()
        WebDriverWait(self.driver, 10).until(EC.url_contains("/login"))
        self.assertIn("/login", self.driver.current_url)

    def test_back_button_functionality(self):
        """Test clicking the 'Back' button to return to the previous page."""
        self.driver.get(self.base_url)
        back_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Back')]")
        back_button.click()
        time.sleep(2)
        self.assertNotEqual(self.driver.current_url, self.base_url)

if __name__ == "__main__":
    unittest.main()
