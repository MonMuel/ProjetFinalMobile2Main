import React, { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { Circle, Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import cheminsEntrepots from '../../../Data/cheminsEntrepots.json';

const ENTREPOTS = [
  {
    id: 'e1',
    nom: 'Entrepot Nord',
    coordinate: { latitude: 45.5185, longitude: -73.5695 },
    icon: 'https://via.placeholder.com/40/0f766e/ffffff?text=E1',
  },
  {
    id: 'e2',
    nom: 'Entrepot Ouest',
    coordinate: { latitude: 45.5315, longitude: -73.5922 },
    icon: 'https://via.placeholder.com/40/2563eb/ffffff?text=E2',
  },
  {
    id: 'e3',
    nom: 'Entrepot Centre',
    coordinate: { latitude: 45.5453, longitude: -73.5656 },
    icon: 'https://via.placeholder.com/40/b45309/ffffff?text=E3',
  },
  {
    id: 'e4',
    nom: 'Entrepot Sud-Ouest',
    coordinate: { latitude: 45.5084, longitude: -73.6134 },
    icon: 'https://via.placeholder.com/40/be123c/ffffff?text=E4',
  },
  {
    id: 'e5',
    nom: 'Entrepot Est',
    coordinate: { latitude: 45.5018, longitude: -73.5524 },
    icon: 'https://via.placeholder.com/40/7c3aed/ffffff?text=E5',
  },
];

const HOME_ICON = 'https://via.placeholder.com/42/111827/ffffff?text=HOME';

function toRad(value) {
  return (value * Math.PI) / 180;
}

function distanceKm(a, b) {
  const R = 6371;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  return 2 * R * Math.asin(Math.sqrt(h));
}

export default function EntrepotsScreen() {
  const [homeCoord, setHomeCoord] = useState({ latitude: 45.5269, longitude: -73.5472 });
  const [selectedId, setSelectedId] = useState('e1');

  useEffect(() => {
    let active = true;

    async function loadLocation() {
      try {
        const permission = await Location.requestForegroundPermissionsAsync();
        if (permission.status !== 'granted') {
          return;
        }
        const current = await Location.getCurrentPositionAsync({});
        if (!active) {
          return;
        }
        setHomeCoord({
          latitude: current.coords.latitude,
          longitude: current.coords.longitude,
        });
      } catch (_error) {
      }
    }

    loadLocation();
    return () => {
      active = false;
    };
  }, []);

  const nearestEntrepot = useMemo(() => {
    let nearest = ENTREPOTS[0];
    let nearestDistance = distanceKm(homeCoord, nearest.coordinate);

    for (let i = 1; i < ENTREPOTS.length; i += 1) {
      const candidate = ENTREPOTS[i];
      const d = distanceKm(homeCoord, candidate.coordinate);
      if (d < nearestDistance) {
        nearest = candidate;
        nearestDistance = d;
      }
    }

    return nearest;
  }, [homeCoord]);

  const pathCoords = useMemo(() => {
    const route = cheminsEntrepots[nearestEntrepot.id] || [];
    return [...route, homeCoord];
  }, [nearestEntrepot, homeCoord]);

  const initialRegion = useMemo(
    () => ({
      latitude: (homeCoord.latitude + nearestEntrepot.coordinate.latitude) / 2,
      longitude: (homeCoord.longitude + nearestEntrepot.coordinate.longitude) / 2,
      latitudeDelta: 0.12,
      longitudeDelta: 0.12,
    }),
    [homeCoord, nearestEntrepot]
  );

  return (
    <View style={styles.container}>
      <View style={styles.listCol}>
        <Text style={styles.leftTitle}>Entrepots</Text>
        {ENTREPOTS.map((item) => {
          const active = selectedId === item.id;
          return (
            <Pressable
              key={item.id}
              style={[styles.warehouseBtn, active && styles.warehouseBtnActive]}
              onPress={() => setSelectedId(item.id)}
            >
              <Text style={[styles.warehouseText, active && styles.warehouseTextActive]}>{item.nom}</Text>
            </Pressable>
          );
        })}
      </View>

      <View style={styles.mapCol}>
        <MapView style={styles.map} initialRegion={initialRegion}>
          {ENTREPOTS.map((item) => (
            <React.Fragment key={item.id}>
              <Circle
                center={item.coordinate}
                radius={5000}
                strokeColor={selectedId === item.id ? 'rgba(15,118,110,0.9)' : 'rgba(15,23,42,0.35)'}
                fillColor={selectedId === item.id ? 'rgba(15,118,110,0.14)' : 'rgba(148,163,184,0.12)'}
              />

              <Marker coordinate={item.coordinate} onPress={() => setSelectedId(item.id)}>
                <View style={[styles.markerWrap, selectedId === item.id && styles.markerWrapActive]}>
                  <Image source={{ uri: item.icon }} style={styles.markerImage} />
                </View>
              </Marker>
            </React.Fragment>
          ))}

          <Marker coordinate={homeCoord}>
            <View style={styles.homeMarkerWrap}>
              <Image source={{ uri: HOME_ICON }} style={styles.homeMarkerImage} />
            </View>
          </Marker>

          <Polyline coordinates={pathCoords} strokeColor="#ef4444" strokeWidth={4} />
        </MapView>

        <Text style={styles.caption}>
          Plus proche: {nearestEntrepot.nom} | Chemin trace depuis le JSON ({pathCoords.length} points)
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    flexDirection: 'row',
  },
  listCol: {
    width: '25%',
    backgroundColor: '#0f172a',
    paddingVertical: 12,
    paddingHorizontal: 6,
  },
  leftTitle: {
    color: '#f8fafc',
    fontWeight: '700',
    marginBottom: 8,
    fontSize: 14,
    textAlign: 'center',
  },
  warehouseBtn: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 6,
    backgroundColor: '#1e293b',
    marginBottom: 8,
  },
  warehouseBtnActive: {
    backgroundColor: '#0f766e',
  },
  warehouseText: {
    color: '#cbd5e1',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 12,
  },
  warehouseTextActive: {
    color: '#ffffff',
  },
  mapCol: {
    width: '75%',
    paddingVertical: 8,
    paddingRight: 8,
  },
  map: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  markerWrap: {
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#0f172a',
    backgroundColor: '#fff',
    padding: 2,
  },
  markerWrapActive: {
    borderColor: '#0f766e',
    transform: [{ scale: 1.08 }],
  },
  markerImage: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  homeMarkerWrap: {
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#ef4444',
    backgroundColor: '#fff',
    padding: 3,
  },
  homeMarkerImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  caption: {
    marginTop: 6,
    color: '#0f172a',
    fontWeight: '600',
    fontSize: 12,
  },
});
