import React, { useState } from 'react';
import {
	ActivityIndicator,
	Image,
	KeyboardAvoidingView,
	Platform,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../Data/AuthContext';

export default function AccueilScreen() {
	const router = useRouter();
	const { isLoading, login } = useAuth();
	const [nom, setNom] = useState('');
	const [mdp, setMdp] = useState('');
	const [error, setError] = useState('');
	const [pending, setPending] = useState(false);

	const handleConnexion = async () => {
		setError('');
		setPending(true);
		try {
			const result = await login(nom, mdp);
			if (!result.success) {
				setError(result.message);
				return;
			}
			if (result.user.admin) {
				router.replace('/(admin)');
			} else {
				router.replace('/(client)/produits');
			}
		} catch (e) {
			setError('Une erreur est survenue');
		} finally {
			setPending(false);
		}
	};

	if (isLoading) {
		return (
			<View style={styles.center}>
				<ActivityIndicator size="large" color="#0080FF" />
				<Text style={styles.loadingText}>Initialisation...</Text>
			</View>
		);
	}

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === 'ios' ? 'padding' : undefined}
		>
			<View style={styles.card}>
				<Text style={styles.company}>DuoTech</Text>
				<Image source={require('../assets/logo1.png')} style={styles.image} resizeMode="contain" />

				<TextInput
					style={styles.input}
					placeholder="Nom"
					value={nom}
					autoCapitalize="none"
					onChangeText={setNom}
				/>
				<TextInput
					style={styles.input}
					placeholder="Mot de passe"
					value={mdp}
					secureTextEntry
					onChangeText={setMdp}
				/>

				{error ? <Text style={styles.error}>{error}</Text> : null}

				<TouchableOpacity style={styles.button} onPress={handleConnexion} disabled={pending}>
					<Text style={styles.buttonText}>{pending ? 'Connexion...' : 'Se connecter'}</Text>
				</TouchableOpacity>

				<Text style={styles.hint}>Demo: Admin / 1234 ou Client Test / 1234</Text>
			</View>

			<Text style={styles.footer}>Sambe</Text>
		</KeyboardAvoidingView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#0D1B2A',
		justifyContent: 'space-between',
		paddingVertical: 40,
		paddingHorizontal: 20,
	},
	center: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#0D1B2A',
	},
	loadingText: {
		marginTop: 10,
		color: '#FFFFFF',
	},
	card: {
		backgroundColor: '#1A2A3A',
		borderRadius: 16,
		padding: 20,
		shadowColor: '#000080',
		shadowOpacity: 0.3,
		shadowRadius: 12,
		elevation: 6,
		borderWidth: 1,
		borderColor: '#0080FF',
	},
	company: {
		fontSize: 28,
		fontWeight: '800',
		color: '#0080FF',
		textAlign: 'center',
		marginBottom: 12,
	},
	image: {
		width: '100%',
		height: 140,
		marginBottom: 18,
		borderRadius: 16,
	},
	input: {
		borderWidth: 2,
		borderColor: '#0080FF',
		borderRadius: 10,
		paddingHorizontal: 12,
		paddingVertical: 10,
		marginBottom: 10,
		backgroundColor: '#0F1823',
		color: '#FFFFFF',
	},
	error: {
		color: '#b91c1c',
		marginBottom: 8,
		textAlign: 'center',
	},
	button: {
		backgroundColor: '#0080FF',
		borderRadius: 10,
		paddingVertical: 12,
		alignItems: 'center',
		marginTop: 4,
	},
	buttonText: {
		color: '#fff',
		fontWeight: '700',
	},
	hint: {
		marginTop: 10,
		textAlign: 'center',
		color: '#7DBBFF',
		fontSize: 12,
	},
	footer: {
		textAlign: 'center',
		color: '#FFFFFF',
		fontWeight: '600',
		fontSize: 16,
	},
});
