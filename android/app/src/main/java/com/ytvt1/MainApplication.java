package com.ytvt1;

import android.app.Application;

import io.invertase.firebase.auth.RNFirebaseAuthPackage;
import com.facebook.react.ReactApplication;
import com.azendoo.reactnativesnackbar.SnackbarPackage;

import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.johnsonsu.rnsoundplayer.RNSoundPlayerPackage;
import org.reactnative.camera.RNCameraPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import io.invertase.firebase.RNFirebasePackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.github.yamill.orientation.OrientationPackage;
import com.brentvatne.react.ReactVideoPackage;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import cl.json.RNSharePackage;
import cl.json.ShareApplication;
import com.oblador.vectoricons.VectorIconsPackage;
import com.rnim.rn.audio.ReactNativeAudioPackage;
import com.zmxv.RNSound.RNSoundPackage;
import com.rnfs.RNFSPackage;
import com.reactnativedocumentpicker.ReactNativeDocumentPicker;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.vinzscam.reactnativefileviewer.RNFileViewerPackage;
import com.kevinresol.react_native_sound_recorder.RNSoundRecorderPackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;

import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.appevents.AppEventsLogger;
// com.goldenowl.twittersignin.TwitterSigninPackage;


import java.util.Arrays;
import java.util.List;
import com.BV.LinearGradient.LinearGradientPackage;

public class MainApplication extends Application implements ReactApplication,  ShareApplication  {

    private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

    protected static CallbackManager getCallbackManager() {
        return mCallbackManager;
    }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),

            new SnackbarPackage(),
            new PickerPackage(),
            new RNSoundPlayerPackage(),
            new RNCameraPackage(),
            new FBSDKPackage(mCallbackManager),

            new RNFirebasePackage(),
              new RNFirebaseAuthPackage(),
            new RNGestureHandlerPackage(),
              new SplashScreenReactPackage(),
              new OrientationPackage(),
              new ReactVideoPackage(),
              new RNGoogleSigninPackage(),
              new RNSharePackage(),
              new VectorIconsPackage(),
              new ReactNativeAudioPackage(),
              new RNSoundPackage(),
              new RNFSPackage(),
              new ReactNativeDocumentPicker(),
              new RNFetchBlobPackage(),
              new RNFileViewerPackage(),
              new RNSoundRecorderPackage(),
              new RNFirebaseMessagingPackage(),
              new RNFirebaseNotificationsPackage(),
      new LinearGradientPackage()
      // new TwitterSigninPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }


    @Override
    public String getFileProviderAuthority() {
        return "com.ytvt1.fileprovider";
    }




}
