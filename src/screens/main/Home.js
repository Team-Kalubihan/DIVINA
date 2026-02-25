import { Text, View, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';

import Logo from '../../assets/DIVINA logo.svg';

export default function Home() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <View style={{alignItems: 'left', width: '100%'}}>
          <Logo width={150} height={32} />
          <Text style={{ fontFamily: 'Poppins', fontSize: 16, marginStart: 0, color: '#0C4FB3'}}>Smart diving companion</Text>
        </View>

        <View style={{ alignItems: 'left', width: '100%', marginTop: 20 }}>
          <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 14, marginStart: 0 }}>Current marine conditions:</Text>
        </View>

        <View style={{ alignItems: 'left', width: '100%', marginTop: 12 }}>
          <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 14, marginStart: 0 }}>Temperature: 28°C</Text>
          <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 14, marginStart: 0 }}>Visibility: 15m</Text>
          <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 14, marginStart: 0 }}>Current Strength: Moderate</Text>
        </View>
      </View>

      <View>
        
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E9ECF4',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 36,
    margin: 10,
    padding: 30,
    alignItems: 'center',
    width: 360,
  },
  quadrant: {
    
  }
});