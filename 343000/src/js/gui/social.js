/**
 * Created by IntelliJ IDEA.
 * User: martin
 * Date: 13/02/2012
 * Time: 12:00
 * @author mshuttleworth
 */
var gui = gui || {};
gui.social = gui.social || {};

(function ()
{
	gui.social.SocialBoot = function ()
	{
	}

	gui.social.SocialBoot.prototype = _.extend({

		init:function (options)
		{
            this.responsesWaiting = 0;
            if(options.facebook){
			    this.fbAppId = options.facebook.id;
			    this.fbPermissions = options.facebook.permissions;
                ++this.responsesWaiting;
    			this.facebookInit();
            }


//			if (options.twitter && !gui.browser.isIE7)
//			{
//                ++this.responsesWaiting;
//				this.twitterInit();
//			}
		},

		facebookInit:function()
		{
			this.fbVars = {
                loaded: false,
				checked:false,
				loggedIn:false,
				authorised:false,
				permissionsGranted:false
			};

//            console.log('facebook init');
			window.fbAsyncInit = _.bind(function ()
			{
                this.fbVars.loaded = true;
//                console.log('fb.init');
//                console.log(FB.init);
				FB.init({
					appId:this.fbAppId,
					channelUrl:"fb_channel_url.html", // Channel File
					status:true, // check login status
					cookie:true, // enable cookies to allow the server to access the session
					xfbml:true  // parse XFBML
				});

				this.facebookGetLoginStatus();

				// Additional initialization code here

//                console.log(this.fbVars.loaded);
			}, this);
//            console.log(this.fbVars.loaded);

			this.facebookLoadAsync();
		},

		facebookLoadAsync:function ()
		{
			var js;
			var id = 'facebook-jssdk';

			if (document.getElementById(id))
			{
				return;
			}

			if ($("#fb-root").length == 0)
			{
				$("body").append($('<div id="fb-root"></div>'));
			}

			js = document.createElement('script');
			js.id = id;
			js.async = true;
            js.src = "//connect.facebook.net/en_US/all.js";
			document.getElementsByTagName('head')[0].appendChild(js);
//            console.log(js);
		},

		facebookResetUserData:function()
		{
			this.fbVars.loggedIn = false;
			this.fbVars.authorised = false;
			this.fbVars.permissionsGranted = false;

			delete this.fbVars.uid;
			delete this.fbVars.accessToken;
			delete this.fbVars.user;
		},

		facebookLogin:function()
		{
            var opts = {};
            if(this.fbPermissions){
                opts.scope = this.fbPermissions;
            }
			FB.login(_.bind(this.facebookLoginHandler, this), opts);
		},

		facebookLoginHandler:function(response)
		{
//            console.log(response);
			if (response.authResponse)
			{
				// Successful login, all parameters met and good
				this.fbVars.loggedIn = true;
				this.fbVars.authorised = true;
				this.fbVars.permissionsGranted = true;

				this.fbVars.uid = response.authResponse.userID;
				this.fbVars.accessToken = response.authResponse.accessToken;

				this.facebookGetMe();
			}
			else
			{
				// Abandoned login - User cancelled login or did not fully authorize.
				this.dispatchFacebookUserData();
			}
		},

		facebookLogout:function()
		{
			this.facebookResetUserData();

			FB.logout(_.bind(function(response)
			{
				this.dispatchFacebookUserData();
			}, this));
		},

		facebookGetMe:function()
		{
			FB.api('/me', _.bind(function(response) {

				this.fbVars.user = response;

				this.dispatchFacebookUserData();

			}, this));
		},

		facebookGetLoginStatus:function()
		{
			this.facebookResetUserData();

			FB.getLoginStatus(_.bind(this.facebookGetLoginStatusHandler, this), true);
		},

		facebookGetLoginStatusHandler:function(response)
		{
//            console.log(response);
			if (response.status === 'connected')
			{
				// the user is logged in and connected to your
				// app, and response.authResponse supplies
				// the user's ID, a valid access token, a signed
				// request, and the time the access token
				// and signed request each expire

				this.fbVars.loggedIn = true;

				if (response.authResponse)
				{

					this.fbVars.authorised = true;
					this.fbVars.uid = response.authResponse.userID;
					this.fbVars.accessToken = response.authResponse.accessToken;

					this.facebookCheckPermissions();
				}
			}
			else if (response.status === 'not_authorized')
			{
				// the user is logged in to Facebook,
				//but not connected to the app

				this.fbVars.loggedIn = true;

				this.dispatchFacebookUserData();
			}
			else
			{
				// the user isn't even logged in to Facebook.

				this.dispatchFacebookUserData();
			}
		},

		facebookCheckPermissions:function ()
		{
			var fbPermissionsArray = _.filter(this.fbPermissions.split(","), function(perm){return !!perm});

			if (fbPermissionsArray.length == 0)
			{
				this.fbVars.permissionsGranted = true;

//				this.dispatchFacebookUserData();
                this.facebookGetMe();
			}
			else
			{
				var fql = "select " + this.fbPermissions + " from permissions where uid=" + this.fbVars.uid;

				FB.api({
						method:"fql.query",
						query:fql
					},

					_.bind(function (permissionsResponse)
					{
						if (permissionsResponse[0])
						{
//                            console.log(permissionsResponse[0]);
//							var scopeArray = this.fbPermissions.split(",");
							var scopeCount = 0;
							for (var i = 0; i < fbPermissionsArray.length; i++)
							{
								if (permissionsResponse[0][fbPermissionsArray[i]] == "1")
								{
									scopeCount++;
								}
							}

							if (scopeCount == fbPermissionsArray.length)
							{
								this.fbVars.permissionsGranted = true;
//								this.facebookGetMe();
							}
							else
							{
//								this.dispatchFacebookUserData();
							}
                            this.facebookGetMe();//always get user data.
						}

					}, this)
				);
			}
		},

		dispatchFacebookUserData:function()
		{
			this.fbVars.checked = true;
			this.trigger("authData:facebook", {type: 'facebook', vars: this.fbVars});
		},

		getFacebookUserData:function()
		{
			return this.fbVars;
		},

//		twitterInit:function()
//		{
//			this.twVars = {
//				checked:false,
//				loggedIn:false
//			};
//
//			twttr.anywhere(_.bind(function (T) {
//
//				this.twitter = T;
//
//				this.twitter.bind("authComplete", _.bind(this.twitterLoginHandler, this));
//				this.twitter.bind("signOut", _.bind(this.twitterLogoutHandler, this));
//
//				if (T.isConnected())
//				{
//					// Twitter connected and good to go
//					this.twitterLoginHandler();
//				}
//				else
//				{
//					// Twitter failed to connect
//					this.dispatchTwitterUserData();
//				}
//			}, this));
//		},
//
//		twitterResetUserData:function()
//		{
//			this.twVars.loggedIn = false;
//
//			delete this.twVars.uid;
//			delete this.twVars.user;
//		},
//
//		twitterLogin:function()
//		{
//			this.twitter.signIn();
//		},
//
//		twitterLoginHandler:function()
//		{
//			this.twVars.uid = this.twitter.currentUser.id;
//			this.twVars.user = this.twitter.currentUser;
//			this.twVars.loggedIn = true;
//
//			this.dispatchTwitterUserData();
//		},
//
//		twitterLogout:function()
//		{
//			this.twitterResetUserData();
//
//			twttr.anywhere.signOut();
//		},
//
//
//		twitterLogoutHandler:function()
//		{
//			this.dispatchTwitterUserData();
//		},
//
//		dispatchTwitterUserData:function()
//		{
//			this.twVars.checked = true;
//			this.trigger("authData:twitter", {type: 'twitter', vars: this.twVars});
//		},
//
//		getTwitterUserData:function()
//		{
//			return this.twVars || {};
//		},

        alreadyPlayedHandler: function(){
            this.trigger("error:alreadyplayed");
        },
        saveHandler: function(){
            this.trigger("error:saved");
        },
        otherErrorHandler: function(){
            this.trigger("error:other");
        }

	}, Backbone.Events);

	gui.Social = new gui.social.SocialBoot();


}());