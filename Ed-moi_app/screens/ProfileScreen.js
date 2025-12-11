// screens/ProfileScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen({ navigation }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const data = await AsyncStorage.getItem("userData");
      if (data) {
        setUserData(JSON.parse(data));
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    }
  };

  const handleLogout = () => {
    Alert.alert("Déconnexion", "Êtes-vous sûr de vouloir vous déconnecter ?", [
      {
        text: "Annuler",
        style: "cancel",
      },
      {
        text: "Déconnexion",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem("userToken");
            await AsyncStorage.removeItem("userData");
            // La navigation sera gérée automatiquement par App.js
            navigation.replace("Login");
          } catch (error) {
            console.error("Erreur lors de la déconnexion:", error);
          }
        },
      },
    ]);
  };

  const trophies = [
    { name: "CUISINIER", unlocked: true },
    { name: "INFORMATICIEN", unlocked: true },
    { name: "PLOMBIER", unlocked: true },
    { name: "MÉCANICIEN", unlocked: false },
    { name: "FINANCIER", unlocked: false },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* En-tête profil */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <LinearGradient colors={["#3a6b40", "#6c9673"]} style={styles.avatar}>
            <Text style={styles.avatarText}>
              {userData?.username?.charAt(0).toUpperCase() || "U"}
            </Text>
          </LinearGradient>
        </View>

        <Text style={styles.username}>
          {userData?.username || "Utilisateur"}
        </Text>
        <Text style={styles.email}>{userData?.email || ""}</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>10</Text>
            <Text style={styles.statLabel}>Terminés</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>2</Text>
            <Text style={styles.statLabel}>En cours</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>Série</Text>
          </View>
        </View>
      </View>

      {/* Section Trophées */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🏆 TROPHÉES</Text>
        <View style={styles.trophiesContainer}>
          {trophies.map((trophy, index) => (
            <View
              key={index}
              style={[styles.trophy, trophy.unlocked && styles.trophyUnlocked]}
            >
              <Text
                style={[
                  styles.trophyText,
                  trophy.unlocked && styles.trophyTextUnlocked,
                ]}
              >
                {trophy.name}
              </Text>
            </View>
          ))}
        </View>
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>Voir tous</Text>
        </TouchableOpacity>
      </View>

      {/* Section Paramètres */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚙️ PARAMÈTRES</Text>

        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>👤 Informations personnelles</Text>
          <Text style={styles.settingArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>🔒 Connexion et sécurité</Text>
          <Text style={styles.settingArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>♿ Accessibilité</Text>
          <Text style={styles.settingArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>🌙 Thème</Text>
          <Text style={styles.settingArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingText}>ℹ️ À propos</Text>
          <Text style={styles.settingArrow}>→</Text>
        </TouchableOpacity>
      </View>

      {/* Bouton Déconnexion */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LinearGradient colors={["#a83232", "#e63946"]} style={styles.gradient}>
          <Text style={styles.logoutButtonText}>🚪 DÉCONNEXION</Text>
        </LinearGradient>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#fff",
    padding: 30,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e8e8e8",
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
  },
  username: {
    fontSize: 24,
    fontWeight: "800",
    color: "#2c2c2c",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 16,
    padding: 20,
    width: "100%",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#3a6b40",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#d0d0d0",
  },
  section: {
    backgroundColor: "#fff",
    marginTop: 12,
    padding: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e8e8e8",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#2c2c2c",
    marginBottom: 16,
  },
  trophiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  trophy: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#d0d0d0",
  },
  trophyUnlocked: {
    backgroundColor: "#ffba00",
    borderColor: "#ffba00",
  },
  trophyText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#999",
  },
  trophyTextUnlocked: {
    color: "#fff",
  },
  viewAllButton: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#3a6b40",
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2c2c2c",
  },
  settingArrow: {
    fontSize: 18,
    color: "#999",
  },
  logoutButton: {
    margin: 20,
    borderRadius: 16,
    overflow: "hidden",
  },
  gradient: {
    padding: 18,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    textTransform: "uppercase",
  },
});
