# yelpcamp
YelpCamp - A web app to track and review campsites.
## Intro
This app was built by Kevin Reznicek during completion of "The Web Developer Bootcamp 2021" on Udemy.

Visit either of the following links for a hosted version of YelpCamp. Please allow a minute for the initial page load; the Heroku server may need to cold start:
- https://bit.ly/3kIPUnI
- https://intense-springs-95269.herokuapp.com/

## Use

In order to use YelpCamp, create a simple account using the Register page. **Please do not input real user data.** Just input any name, email, and password at the following page to register:
- https://intense-springs-95269.herokuapp.com/register

If you have already created an account, use the Login page instead.

Once logged in, you will be able to create campgrounds, add reviews to existing campgrounds, and edit/delete campgrounds that you own.

## Notable Features
- YelpCamp uses MapBox to display all campgrounds. On the "All Campgrounds" page, the map will group nearby campgrounds into clusters when sufficiently zoomed out, and then ungroup them when sufficiently zoomed in.
- When creating a new campground or editing an existing one, YelpCamp will query the MapBox API to look for coordinates for the location input string. Those coordinates are then used on the maps in the "All Campgrounds" page and in the individual campground's page.
- YelpCamp stores passwords securely using BCrypt to salt and hash passwords before storing them.
- YelpCamp uses signed cookies to store and keep track of sessions.
- The production version of YelpCamp uses MongoDB Atlas as its database and Cloudinary for image saving and hosting. It makes requests to both as needed to create, load, save, and delete content. The development version of YelpCamp uses a local MongoDB database for development and testing. 
- YelpCamp uses Helmet to add layers of security against cross-site scripting, Mongo injection, and more.


## Legal
Note:
The favicon is under a Creative Commons license by Mello on thenounproject.com.
https://thenounproject.com/term/camping/2093273/
