#!/usr/bin/env python3
"""Take a screenshot of the welcome page"""

import subprocess
import time
import os

# Install required packages
try:
    subprocess.run(['pip', 'install', 'selenium', 'pillow'], check=True, capture_output=True)
except:
    pass

try:
    from selenium import webdriver
    from selenium.webdriver.chrome.options import Options
    from selenium.webdriver.common.by import By
    from selenium.webdriver.support.ui import WebDriverWait
    from selenium.webdriver.support import expected_conditions as EC
    import time
    
    # Setup Chrome options
    chrome_options = Options()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.add_argument('--window-size=1200,800')
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--remote-debugging-port=9222')
    chrome_options.binary_location = '/nix/store/zi4f80l169xlmivz8vja8wlphq74qqk0-chromium-125.0.6422.141/bin/chromium'
    
    print("Setting up Chrome driver...")
    driver = webdriver.Chrome(options=chrome_options)
    
    try:
        print("Navigating to localhost:5000...")
        driver.get('http://localhost:5000')
        
        # Wait for page to load
        time.sleep(3)
        
        # Wait for the BoredMama logo or main content to load
        try:
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.TAG_NAME, "h1"))
            )
        except:
            print("Timeout waiting for content, taking screenshot anyway...")
        
        print("Taking screenshot...")
        driver.save_screenshot('welcome_page_screenshot.png')
        print("Screenshot saved as welcome_page_screenshot.png")
        
        # Get page title and some basic info
        title = driver.title
        print(f"Page title: {title}")
        
        # Try to find key elements
        try:
            h1_element = driver.find_element(By.TAG_NAME, "h1")
            print(f"Main heading: {h1_element.text}")
        except:
            print("Could not find h1 element")
            
        try:
            input_element = driver.find_element(By.CSS_SELECTOR, "input[placeholder*='name']")
            print(f"Input placeholder: {input_element.get_attribute('placeholder')}")
        except:
            print("Could not find name input")
            
    finally:
        driver.quit()
        
except ImportError as e:
    print(f"Selenium not available: {e}")
    print("Using basic curl to check if server is running...")
    result = subprocess.run(['curl', '-s', '-o', '/dev/null', '-w', '%{http_code}', 'http://localhost:5000'], 
                          capture_output=True, text=True)
    print(f"Server response code: {result.stdout}")
    
except Exception as e:
    print(f"Error taking screenshot: {e}")
    
    # Fallback - just check if server is responding
    result = subprocess.run(['curl', '-s', '-o', '/dev/null', '-w', '%{http_code}', 'http://localhost:5000'], 
                          capture_output=True, text=True)
    print(f"Server response code: {result.stdout}")