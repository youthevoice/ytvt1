package com.ytvt1;

import android.app.Application;

import com.facebook.react.ReactApplication;
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


import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication,  ShareApplication  {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),

            new RNFirebasePackage(),
            new RNGestureHandlerPackage(),
              new SplashScreenReactPackage(),
              new OrientationPackage(),
              new ReactVideoPackage(),
              new RNGoogleSigninPackage(),
              new RNSharePackage(),
              new VectorIconsPackage()
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
