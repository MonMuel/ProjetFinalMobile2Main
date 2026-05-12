import React, { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { Circle, Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import cheminsEntrepots from '../../../Data/cheminsEntrepots.json';
import { useI18n } from '../../../Data/traduction';
import { useTheme } from '../../../Data/ThemeContext';

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
const ENTREPOT_OUEST_ID = 'e2';

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
  const { t } = useI18n();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [homeCoord, setHomeCoord] = useState({ latitude: 45.5269, longitude: -73.5472 });
  const [selectedId, setSelectedId] = useState('e1');
  const [pathCoords, setPathCoords] = useState([]);

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

  useEffect(() => {
    let active = true;

    function applyFallbackPath() {
      const route = cheminsEntrepots[nearestEntrepot.id] || [];
      if (route.length === 0) {
        setPathCoords([nearestEntrepot.coordinate, homeCoord]);
        return;
      }

      const lastPoint = route[route.length - 1];
      const canJoinHome = distanceKm(lastPoint, homeCoord) <= 2;
      setPathCoords(canJoinHome ? [...route, homeCoord] : route);
    }

    async function loadDrivingRoute() {
      const from = nearestEntrepot.coordinate;
      const to = homeCoord;
      const url = `https://router.project-osrm.org/route/v1/driving/${from.longitude},${from.latitude};${to.longitude},${to.latitude}?overview=full&geometries=geojson&steps=false`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('OSRM request failed');
        }

        const data = await response.json();
        const geometry = data?.routes?.[0]?.geometry?.coordinates;
        const roadCoords = Array.isArray(geometry)
          ? geometry.map(([longitude, latitude]) => ({ latitude, longitude }))
          : [];

        if (!active) {
          return;
        }

        if (roadCoords.length > 1) {
          setPathCoords(roadCoords);
          return;
        }

        applyFallbackPath();
      } catch (_error) {
        if (!active) {
          return;
        }
        applyFallbackPath();
      }
    }

    loadDrivingRoute();
    return () => {
      active = false;
    };
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
        <Text style={styles.leftTitle}>{t('warehouses_title')}</Text>
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
                strokeColor={selectedId === item.id ? 'rgba(15,118,110,0.9)' : 'rgba(51,65,85,0.35)'}
                fillColor={selectedId === item.id ? 'rgba(15,118,110,0.14)' : 'rgba(148,163,184,0.12)'}
              />

              <Marker coordinate={item.coordinate} onPress={() => setSelectedId(item.id)}>
                <View
                  style={[
                    styles.markerWrap,
                    item.id === ENTREPOT_OUEST_ID && styles.markerWrapWest,
                    selectedId === item.id && styles.markerWrapActive,
                  ]}
                >
                  {item.id === ENTREPOT_OUEST_ID ? (
                    <MaterialCommunityIcons name="warehouse" size={24} color={colors.primaryStrong} />
                  ) : (
                    <View style={styles.markerDot} />
                  )}
                </View>
              </Marker>
            </React.Fragment>
          ))}

          <Marker coordinate={homeCoord}>
            <View style={styles.homeMarkerWrap}>
              <Image source={{ uri: HOME_ICON }} style={styles.homeMarkerImage} />
            </View>
          </Marker>

          <Polyline coordinates={pathCoords} strokeColor={colors.danger} strokeWidth={4} />
        </MapView>

        <Text style={styles.caption}>
          {t('warehouses_nearest', { name: nearestEntrepot.nom })} | {t('warehouses_path_points', { count: pathCoords.length })}
        </Text>
      </View>
    </View>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      flexDirection: 'row',
    },
    listCol: {
      width: '25%',
      backgroundColor: colors.mapContainer,
      paddingVertical: 12,
      paddingHorizontal: 6,
    },
    leftTitle: {
      color: colors.headerTitle,
      fontWeight: '700',
      marginBottom: 8,
      fontSize: 14,
      textAlign: 'center',
    },
    warehouseBtn: {
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 6,
      backgroundColor: colors.mapCard,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: colors.borderSoft,
    },
    warehouseBtnActive: {
      backgroundColor: '#0f766e',
      borderColor: '#0f766e',
    },
    warehouseText: {
      color: colors.mapText,
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
      borderColor: colors.mapContainer,
      backgroundColor: '#fff',
      padding: 5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    markerWrapWest: {
      borderColor: colors.primaryStrong,
      backgroundColor: '#fef3c7',
    },
    markerDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: '#334155',
    },
    markerWrapActive: {
      borderColor: '#0f766e',
      transform: [{ scale: 1.08 }],
    },
    homeMarkerWrap: {
      borderRadius: 24,
      borderWidth: 2,
      borderColor: colors.danger,
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
      color: colors.mapCaption,
      fontWeight: '600',
      fontSize: 12,
    },
  });
}

