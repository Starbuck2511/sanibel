---
layout: default
---

# The Sunbelt App Project

* [Motivation](#motivation)
* [Screens](#screens)
* [Features](#features)
* [License](#license)
* [Privacy](#privacy)


## [](#header-2)Motivation
Sunbelt is an app that should make your life easier when it comes to organize appointments of a group an its members.

The most common method for organizing appointments is still by sending an e-mail to the group. But this has some trade offs:

* You need someone who takes care of sending the mail to the group members.
* You need someone who takes care of evaluating the responses.
* Often you get a lot of unwanted emails when members reply to all.
* You can not see the a current feedback on an appointment.

So this is, where the Sunbelt app is trying to make it easier and more comfortable for all group members.

## Screens
![]({{ site.url }}/assets/images/login.png)    |![]({{ site.url }}/assets/images/groups.png)
![]({{ site.url }}/assets/images/feedback.png) |![]({{ site.url }}/assets/images/chat.png)

## Features

### Login/Sign up
The app is using Google's firebase authentication methods for sign up and login.

### Creating your own groups
Just choose "Groups" in the menu and you can easily create a new group by touching the icon in the top right corner.

### Inviting other users to your group
In the group's view just touch the "share" button on the right bottom. You can share your group by using your favorite messenger.

A code and pin of your group will then be sent to the users you want to invite to your group

### Become a member of an existing group
Once you have recieved a pin and code for a group, you can enter them by choosing "Invitations" from the menu.

### Making new appointments for a group
In a group's view just use the button on the top right corner. Enter a name for the new appointment, select a date and choose if the appointement will be a single one or a series of appointments.

### Giving feedback for appointments
Just select the group and then select the appointment you want to reply to. You can accept and decline an appointment. You instantly will see an overview of all replies on that appointment.

### Own chat for every group
On creation every group gets its own chat for sending additional messages to members of a group.

### Push notifications
You can get push notifications of new chat messages, when you allow the app to send them to you. You can easily turn them off under "Settings".

### Change language
You can change the language under "Settings".

### Forgot password
If you forgot your password, please use the link on the login screen an follow the instructions.

### Network hint
The app needs an internet connection for communication with backend services. You will get a hint on the bottom when internet connection is lost.

### Error tracking
The app uses a remote error tracking to improve stability. In case of errors or bugs feel free to open an issue on the github project page.
[https://github.com/Starbuck2511/sanibel/issues](https://github.com/Starbuck2511/sanibel/issues).

## License
[MIT License](https://github.com/Starbuck2511/sanibel/blob/master/LICENSE.md)

## Privacy
[Privacy data]({{ site.url }}/assets/docs/data-privacy.pdf)







