import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

import time

class TestLoginPage(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        chrome_options = Options()
        # chrome_options.headless = True  # Uncomment if you want to run headless
        chrome_service = Service('/usr/bin/chromedriver')  
        cls.driver = webdriver.Chrome(service=chrome_service, options=chrome_options)
        cls.driver.maximize_window()
        cls.driver.implicitly_wait(10)
        cls.base_url = "http://localhost:6014/login" 

    @classmethod
    def tearDownClass(cls):
        cls.driver.quit()

    def test_login_with_valid_credentials(self):
        self.driver.get(self.base_url)
        email_field = self.driver.find_element(By.NAME, "email")
        password_field = self.driver.find_element(By.NAME, "password")
        email_field.send_keys("testuser@example.com")
        password_field.send_keys("password123")
        password_field.send_keys(Keys.RETURN)
        WebDriverWait(self.driver, 10).until(EC.url_contains("/manage-course"))
        self.assertIn("/manage-course", self.driver.current_url)

    def test_login_with_invalid_credentials(self):
        self.driver.get(self.base_url)
        email_field = self.driver.find_element(By.NAME, "email")
        password_field = self.driver.find_element(By.NAME, "password")
        email_field.send_keys("testuser@example.com")
        password_field.send_keys("wrongpassword")
        password_field.send_keys(Keys.RETURN)
        time.sleep(2)
        error_message = self.driver.find_element(By.XPATH, "//p[contains(text(), 'Invalid credentials')]")
        self.assertTrue(error_message.is_displayed())

    def test_back_button_functionality(self):
        self.driver.get(self.base_url)
        back_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Back')]")
        back_button.click()
        time.sleep(2)
        self.assertNotEqual(self.driver.current_url, self.base_url)

if __name__ == "__main__":
    unittest.main()
