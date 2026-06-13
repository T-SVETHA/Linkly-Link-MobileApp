plugins {
    java
}

java {
    toolchain {
        languageVersion.set(JavaLanguageVersion.of(17))
    }
}

dependencies {
    testImplementation("org.seleniumhq.selenium:selenium-java:4.21.0")
    testImplementation("org.junit.jupiter:junit-jupiter:5.10.2")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

tasks.test {
    useJUnitPlatform()
    // Make sure both XML and HTML reports are generated
    reports.html.required.set(true)
    reports.junitXml.required.set(true)
}
