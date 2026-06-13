package com.linkly.webtests;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import java.io.File;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class DashboardTest {
    private WebDriver driver;

    @BeforeEach
    public void setUp() {
        ChromeOptions options = new ChromeOptions();
        // Run in headless mode so it works in environments without a screen (e.g. GitHub Actions)
        options.addArguments("--headless=new");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        driver = new ChromeDriver(options);
    }

    @AfterEach
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    private String getIndexPageUrl() {
        File htmlFile = new File("web_parent_dashboard/index.html");
        if (!htmlFile.exists()) {
            // If running inside the subproject directory, look up one level
            htmlFile = new File("../web_parent_dashboard/index.html");
        }
        assertTrue(htmlFile.exists(), "index.html should exist at " + htmlFile.getAbsolutePath());
        return htmlFile.toURI().toString();
    }

    @Test
    public void testLandingPageLoad() {
        driver.get(getIndexPageUrl());

        // Verify title
        String title = driver.getTitle();
        assertEquals("Linkly - Unified Web Suite", title, "Page title does not match!");

        // Verify header text
        WebElement header = driver.findElement(By.tagName("h1"));
        assertEquals("Linkly", header.getText(), "Main header text is incorrect!");
    }

    @Test
    public void testNavigationToParentPortal() {
        driver.get(getIndexPageUrl());

        // Click the Parent Portal card
        WebElement parentCardLink = driver.findElement(By.cssSelector("a.parent-card"));
        parentCardLink.click();

        // Verify we navigated to parent.html
        String currentUrl = driver.getCurrentUrl();
        assertTrue(currentUrl.endsWith("parent.html"), "Should navigate to parent.html, but was: " + currentUrl);

        // Verify page content by checking if the Device Lockdown header is present
        WebElement lockdownHeader = driver.findElement(By.xpath("//h3[contains(text(),'Device Lockdown')]"));
        assertTrue(lockdownHeader.isDisplayed(), "Device Lockdown section should be visible on the parent portal");
    }

    @Test
    public void testNavigationToChildCompanion() {
        driver.get(getIndexPageUrl());

        // Click the Child Companion card
        WebElement childCardLink = driver.findElement(By.cssSelector("a.child-card"));
        childCardLink.click();

        // Verify we navigated to child.html
        String currentUrl = driver.getCurrentUrl();
        assertTrue(currentUrl.endsWith("child.html"), "Should navigate to child.html, but was: " + currentUrl);

        // Verify page content by checking if the Allocated Screen Time header is present
        WebElement screenTimeHeader = driver.findElement(By.xpath("//h3[contains(text(),'Allocated Screen Time')]"));
        assertTrue(screenTimeHeader.isDisplayed(), "Allocated Screen Time section should be visible on the child portal");
    }
}
