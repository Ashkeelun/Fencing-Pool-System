# Fencing-Pool-System

Introduction
------------
This repository contains the files and instructions to setup and implement your own Fencing Pool System. This Google Site, web based system is designed to do the following things. Sets up tournaments and/or pools for fencing competitions. It implements bout order and tracks each bout's scores, calculating the pool resaults live. All updates can then be posted live to a public facing Google Site Page, allowing contestants and spectators to monitor the progess of the Competition. All scores are saved live to Google SpreadSheet Files and can be retreived later if you get disconnected, but does require an internet connection to use.


How to Setup
------------
 1.  Create a Google Site, with the following pages:
     a.  Private: Pool System Page - This page will contain the system interface. 
     b.  Private: Named "Results" on the root of the Site - This page will contain test results.
 2.  Create a page template named "basic-blank-page".
 3.  Under the Google Site, go to Manage Site > Apps Scripts.
 4.  Click on "Add new script" and copy the program files from github there.
 5.  Save the script as a version and deploy as a web app.
 6.  to deploy as a web app, select the version you saved, select execute the app as: "Me".
 7.  Copy the Web App URL and go to the Pool System Page and add the App Script to that page.
 8.  Follow the instructions located in the Google SpreadSheet System Files in github.
 9.  Copy the retrieved IDs to the function at line 1016 in the Code.gs file.
 10.  Finally go through the remaining code and change any other DNS references to your site.
