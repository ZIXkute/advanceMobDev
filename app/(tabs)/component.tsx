import React from "react";
import { Text, Button, Image, ScrollView, StyleSheet, Alert } from "react-native";

export default function ComponentShowcase() {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.heading}>Component Scavenger Hunt</Text>

      <Image
        source={require("@/assets/images/sir.png")}
        style={styles.image}
      />

      <Button
        title="Click Me!"
        onPress={() => Alert.alert("Sir, Tapos na po.")}
      />

      <Text style={styles.paragraph}>Scrollable list below:</Text>
      {Array.from({ length: 5 }).map((_, i) => (
        <Text key={i} style={styles.scrollItem}>
          Item {i + 1}
        </Text>
      ))}
      

      
      <Text style={styles.footerText}>
        Ang Tigolang Lyrics:
      </Text>
      <Text style={styles.footerText}>
      La, la, la, la, la, la
La, la, lo, la , la, la,
La, la, la, la, la, la, lo, la...

Ang akong lolo magsige lag pagwapo
Bisag wala na sya'y buhok sa iyang ulo
Ang akong lola kay mag lagot niya
Kay ang chiks pwirting man gyud niyang pilita

Sige'g pamada bisag nangurog gi ka ihi na
Mao kana si lolo, ang akong lolo nga gwapo...

Ang tigulang bisag bako
Maningkamot mobarog motindog aron molabyog
Ang tigulang bisag bako
Maningkamot mobarog motindog aron molabyog

Karon si lola nasada nagpagwapa
Nagbutag pulbos lipstick nagmaskara
Unya si lolo pwirti niyang lagota
Kay si lola magsul-ob man diay mubo na saya

Sige'g lamba-lamba bisag nagurog lang tuhod niya
Mao kana si lola ang akong lola nga gwapa

Ang tigulang bisag bako
Maningkamot mobarog motindog aron molabyog
Ang tigulang bisag bako
Maningkamot mobarog motindog aron molabyog

Sa dihang naglalis sila,
Kung kinsa gyud ang gwapo og gwapa
Niabot si mama nagdala og planggana
Gibulanan silang duha...

Ang tigulang bisag bako
Maningkamot mobarog motindog aron molabyog
Ang tigulang bisag bako
Maningkamot mobarog motindog aron molabyog

La, la, la, la, la, la
La, la, lo, la , la, la,
La, la, la, la, la, la, lo, la...
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 16,
    backgroundColor: "#FFFF00",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
    color: "#333",
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 12,
    lineHeight: 22,
    color: "#555",
  },
  image: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginBottom: 16,
  },
  scrollItem: {
    padding: 10,
    marginVertical: 4,
    backgroundColor: "#fff",
    borderRadius: 6,
    textAlign: "center",
    elevation: 2,
  },
  footerText: {
    fontSize: 16,
    marginTop: 20,
    textAlign: "center",
    fontWeight: "600",
    color: "#333",
  },
  gif: {
    width: 200,
    height: 200,
    alignSelf: "center",
    marginTop: 20,
  },
});
