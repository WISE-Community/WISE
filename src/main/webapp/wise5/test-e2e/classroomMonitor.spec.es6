// E2E test for Classroom Monitor
describe('WISE Classroom Monitor', () => {

    function hasClass(element, cls) {
        return element.getAttribute('class').then((classes) => {
            return classes.split(' ').indexOf(cls) !== -1;
        });
    };

    /**
     * @name waitForUrlToChangeTo
     * @description Wait until the URL changes to match a provided regex
     * @param {RegExp} urlRegex wait until the URL changes to match this regex
     * @returns {!webdriver.promise.Promise} Promise
     */
    function waitForUrlToChangeTo(urlRegex) {
        var currentUrl;

        return browser.getCurrentUrl().then(function storeCurrentUrl(url) {
                currentUrl = url;
            }
        ).then(function waitForUrlToChangeTo() {
                return browser.wait(function waitForUrlToChangeTo() {
                    return browser.getCurrentUrl().then(function compareCurrentUrl(url) {
                        return urlRegex.test(url);
                    });
                });
            }
        );
    };

    it('should log in using preview username and password and open the classroom monitor tool', () => {
        browser.ignoreSynchronization = true;  // doesn't use Angular
        browser.get('http://localhost:8080/wise/login');
        expect(browser.getTitle()).toEqual('Sign In');
        $('#username').sendKeys('preview');
        $('#password').sendKeys('wise');
        $('#signInButton').click();

        expect(browser.getCurrentUrl()).toEqual('http://localhost:8080/wise/teacher');
        expect(browser.getTitle()).toEqual('WISE Teacher Dashboard');
        // Find and click on the classroom monitor link
        let classroomMonitorLink = $(".classroomMonitor");
        expect(classroomMonitorLink.isPresent()).toBeTruthy();
        classroomMonitorLink.click();

        // Clicking on the classroom monitor link should open the classroom monitor in a new window
        browser.getAllWindowHandles().then((handles) => {
            browser.switchTo().window(handles[1]).then(() => {
                browser.ignoreSynchronization = false;  // uses Angular
                browser.refresh();  // needed for this issue https://github.com/angular/protractor/issues/2643
                browser.waitForAngular();   // wait for Angular to load
                expect(browser.getCurrentUrl()).toContain('http://localhost:8080/wise/classroomMonitor/');
                expect(browser.getTitle()).toEqual('WISE Classroom Monitor');

                // check for elements on the page
                expect($("#gradeByWorkgroupButton").isPresent()).toBeTruthy();
                expect($("#gradeByStepButton").isPresent()).toBeTruthy();
                expect($("#pauseScreensButton").isPresent()).toBeTruthy();
                expect($("#downloadStudentWorkButton").isPresent()).toBeTruthy();

                // close the current window
                browser.driver.close().then(() => {
                    // switch to the main authoring window
                    browser.switchTo().window(handles[0]);
                });
            });
        });

        browser.ignoreSynchronization = true;  // doesn't use Angular
        expect(browser.getTitle()).toEqual('WISE Teacher Dashboard');
        var signOutButton = $("#signOut");
        expect(signOutButton.isPresent()).toBeTruthy();
        signOutButton.click();
        expect(browser.getTitle()).toEqual('Web-based Inquiry Science Environment (WISE)');
        expect(browser.getCurrentUrl()).toEqual('http://localhost:8080/wise/');
    });
});