import { Text, View, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DivePlans() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ alignItems: 'left', width: '100%', marginTop: 20}}>
        <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 24, fontWeight: 'bold', color: '#66707F' , marginStart: 10}}>Your booked sites</Text>
      </View>
      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E9ECF4',
    alignItems: 'center',
    paddingHorizontal: 20
  },
});