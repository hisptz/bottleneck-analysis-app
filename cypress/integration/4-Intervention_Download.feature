User story: As a district-level user, I want to download chart, sub-level, and root cause data in one zip.

Scenario: Download as zip file
Given intervention page
And I click on the “More” Button
And I click on “Download zip”
Then a zip file should be downloaded
