# Guia de Integração - R3 Connect Plus

## Visão Geral

Este documento detalha como integrar as principais dependências do R3 Connect Plus: Mapbox, Spotify, Bluetooth e Geolocalização.

---

## 1. Mapbox GL (Navegação e Mapas)

### Instalação
```bash
npm install @rnmapbox/maps
```

### Configuração iOS
1. Atualizar `ios/Podfile`:
```ruby
target 'r3-connect-plus' do
  # ... outras dependências ...
  
  pre_install do |installer|
    $RNMapboxMaps.pre_install(installer)
  end
  
  post_install do |installer|
    $RNMapboxMaps.post_install(installer)
    # ... outros post_install hooks ...
  end
end
```

2. Instalar dependências:
```bash
cd ios && pod install && cd ..
```

3. Adicionar token de acesso em `ios/{ProjectName}/Info.plist`:
```xml
<key>MBXAccessToken</key>
<string>YOUR_MAPBOX_ACCESS_TOKEN</string>
```

4. Adicionar permissões de localização em `Info.plist`:
```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>R3 Connect Plus usa sua localização para navegação e rastreamento de viagens.</string>
<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>R3 Connect Plus usa sua localização para navegação e rastreamento de viagens.</string>
```

### Configuração Android
1. Adicionar repositório Maven em `android/settings.gradle`:
```gradle
dependencyResolutionManagement {
  repositoriesMode.set(RepositoriesMode.PREFER_SETTINGS)
  repositories {
    google()
    mavenCentral()
    maven { url = uri("https://api.mapbox.com/downloads/v2/releases/maven") }
  }
}
```

2. Criar `android/app/src/main/res/values/mapbox_access_token.xml`:
```xml
<resources>
  <string name="mapbox_access_token">YOUR_MAPBOX_ACCESS_TOKEN</string>
</resources>
```

3. Adicionar permissões em `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

### Uso Básico
```tsx
import { MapView } from '@rnmapbox/maps';

export function MapScreen() {
  return (
    <MapView
      style={{ flex: 1 }}
      centerCoordinate={[-74.5, 40]}
      zoomLevel={9}
    >
      {/* Adicionar layers, markers, etc */}
    </MapView>
  );
}
```

### Obter Token Mapbox
1. Criar conta em [mapbox.com](https://www.mapbox.com)
2. Ir para "Access tokens" no dashboard
3. Copiar token público (começa com `pk.`)

---

## 2. Spotify Remote SDK

### Instalação
```bash
npm install @vanlesson/react-native-spotify-remote
```

### Configuração iOS
1. Adicionar ao `ios/Podfile`:
```ruby
target 'r3-connect-plus' do
  # ... outras dependências ...
  pod 'RNSpotifyRemote', :path => '../node_modules/@vanlesson/react-native-spotify-remote'
end
```

2. Instalar:
```bash
cd ios && pod install && cd ..
```

3. Modificar `ios/r3-connect-plus/AppDelegate.mm`:
```objc
#import <RNSpotifyRemote.h>

- (BOOL)application:(UIApplication *)application 
            openURL:(NSURL *)URL 
  sourceApplication:(NSString *)sourceApplication 
         annotation:(id)annotation {
  return [[RNSpotifyRemoteAuth sharedInstance] application:application 
                                                   openURL:URL 
                                         sourceApplication:sourceApplication 
                                                annotation:annotation];
}
```

4. Adicionar permissões em `Info.plist`:
```xml
<key>NSLocalNetworkUsageDescription</key>
<string>R3 Connect Plus precisa acessar sua rede local para controlar o Spotify.</string>
<key>NSBonjourServices</key>
<array>
  <string>_spotify-connect._tcp</string>
</array>
```

### Configuração Android
1. Adicionar ao `android/app/build.gradle`:
```gradle
dependencies {
  // ... outras dependências ...
  implementation project(':react-native-spotify-remote')
}
```

2. Adicionar em `android/settings.gradle`:
```gradle
include ':react-native-spotify-remote'
project(':react-native-spotify-remote').projectDir = new File(rootProject.projectDir, '../node_modules/@vanlesson/react-native-spotify-remote/android')
```

3. Adicionar em `android/app/src/main/AndroidManifest.xml`:
```xml
<queries>
  <package android:name="com.spotify.music" />
</queries>

<activity
  android:exported="true"
  android:name="com.spotify.sdk.android.authentication.AuthCallbackActivity"
  android:theme="@android:style/Theme.Translucent.NoTitleBar">
  <intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data
      android:scheme="YOUR_REDIRECT_SCHEME"
      android:host="YOUR_REDIRECT_HOST" />
  </intent-filter>
</activity>
```

### Uso Básico
```tsx
import { SpotifyRemoteAuth, SpotifyRemote } from '@vanlesson/react-native-spotify-remote';

async function initSpotify() {
  const clientID = 'YOUR_SPOTIFY_CLIENT_ID';
  const redirectURL = 'YOUR_REDIRECT_URL';
  
  try {
    const session = await SpotifyRemoteAuth.authorize({
      clientID,
      redirectURL,
      scopes: ['streaming', 'user-read-private', 'user-read-email'],
    });
    
    await SpotifyRemote.connect(session);
  } catch (error) {
    console.error('Spotify auth failed:', error);
  }
}
```

### Obter Credenciais Spotify
1. Ir para [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)
2. Criar uma nova aplicação
3. Copiar `Client ID` e `Client Secret`
4. Definir `Redirect URIs` (ex: `r3connect://spotify-callback`)

---

## 3. Bluetooth Low Energy (BLE)

### Instalação
```bash
npm install react-native-ble-plx
```

### Configuração iOS
1. Adicionar ao `ios/Podfile`:
```ruby
pod 'react-native-ble-plx', :path => '../node_modules/react-native-ble-plx'
```

2. Instalar:
```bash
cd ios && pod install && cd ..
```

3. Adicionar permissões em `Info.plist`:
```xml
<key>NSBluetoothPeripheralUsageDescription</key>
<string>R3 Connect Plus precisa de Bluetooth para conectar à sua moto.</string>
<key>NSBluetoothCentralUsageDescription</key>
<string>R3 Connect Plus precisa de Bluetooth para conectar à sua moto.</string>
```

### Configuração Android
1. Adicionar permissões em `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.BLUETOOTH" />
<uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
<uses-permission android:name="android.permission.BLUETOOTH_SCAN" />
<uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```

### Uso Básico
```tsx
import { BleManager } from 'react-native-ble-plx';

const manager = new BleManager();

async function scanDevices() {
  manager.startDeviceScan(null, null, (error, device) => {
    if (error) {
      console.error('Scan error:', error);
      return;
    }
    
    if (device?.name?.includes('Yamaha')) {
      console.log('Found Yamaha device:', device.name);
    }
  });
  
  // Parar scan após 10 segundos
  setTimeout(() => manager.stopDeviceScan(), 10000);
}
```

---

## 4. Geolocalização

### Instalação
```bash
npm install expo-location
```

### Configuração iOS
Adicionar permissões em `Info.plist`:
```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>R3 Connect Plus usa sua localização para navegação.</string>
<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>R3 Connect Plus usa sua localização para rastreamento de viagens.</string>
```

### Configuração Android
Adicionar permissões em `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

### Uso Básico
```tsx
import * as Location from 'expo-location';

async function getCurrentLocation() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  
  if (status !== 'granted') {
    console.error('Location permission denied');
    return;
  }
  
  const location = await Location.getCurrentPositionAsync({});
  console.log('Current location:', location.coords);
}
```

---

## 5. Variáveis de Ambiente

Criar arquivo `.env` na raiz do projeto:
```
MAPBOX_ACCESS_TOKEN=pk_your_mapbox_token
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_REDIRECT_URL=r3connect://spotify-callback
```

Carregar em `app.config.ts`:
```ts
import dotenv from 'dotenv';
dotenv.config();

const env = {
  mapboxToken: process.env.MAPBOX_ACCESS_TOKEN,
  spotifyClientId: process.env.SPOTIFY_CLIENT_ID,
  spotifyRedirectUrl: process.env.SPOTIFY_REDIRECT_URL,
};
```

---

## 6. Checklist de Integração

- [ ] Mapbox token obtido e configurado
- [ ] Spotify credentials criadas
- [ ] iOS Podfile atualizado
- [ ] Android AndroidManifest.xml atualizado
- [ ] Permissões de localização configuradas
- [ ] Permissões de Bluetooth configuradas
- [ ] AppDelegate.mm modificado (iOS)
- [ ] Variáveis de ambiente definidas
- [ ] Testado em iOS (Expo Go)
- [ ] Testado em Android (Expo Go)

---

## 7. Troubleshooting

### Mapbox não carrega
- Verificar se token é válido (começa com `pk.`)
- Verificar se `Info.plist` tem a chave correta
- Limpar cache: `npm start -- --clear`

### Spotify não conecta
- Verificar se app Spotify está instalado
- Verificar se credenciais estão corretas
- Verificar redirect URL

### Bluetooth não funciona
- Verificar se permissões estão concedidas
- Verificar se dispositivo está em modo emparelhamento
- Testar com outro app Bluetooth

---

## Referências

- [Mapbox Maps SDK for React Native](https://docs.mapbox.com/help/tutorials/getting-started-react-native/)
- [Spotify Remote SDK](https://developer.spotify.com/documentation/ios/)
- [React Native BLE PLX](https://github.com/dotintent/react-native-ble-plx)
- [Expo Location](https://docs.expo.dev/versions/latest/sdk/location/)
