Go to Maven Official Page https://maven.apache.org/download.cgi
Download 
Apache Maven 3.9.9 (8e8579a9e76f7d015ee5ec7bfcdc97d260186937)
Maven home: C:\apache-maven-3.9.9-bin\apache-maven-3.9.9
Java version: 23.0.2, vendor: Oracle Corporation, runtime: C:\Program Files\Java\jdk-23
Default locale: en_CA, platform encoding: UTF-8
OS name: "windows 11", version: "10.0", arch: "amd64", family: "windows"



Search for "Environment Variables" in Windows
Under System Variables, find Path
Click Edit → New → Add Maven’s bin path
OK and restart your terminal

verify the installation 

mvn -version
✅ If you see Maven version & Java info, it's fixed!

if not 
mvn clean install
the locate your GIT FILE find POM.xml 

CD until the folder to ...\backend\budgetingapp-backend

Run this 
mvn archetype:generate -DgroupId=com.budgetapp -DartifactId=budgeting-backend -DarchetypeArtifactId=maven-archetype-quickstart -DinteractiveMode=false
Then 
mvn clean install again 

after creation. 
Open Visual studio 
go to frontend terminal 
NPM INSTALL 
then 
npm run start:all

This should start the app for you. 

