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
import { useI18n } from '../Data/traduction';
import { useTheme } from '../Data/ThemeContext';

export default function AccueilScreen() {
	const router = useRouter();
	const { isLoading, login } = useAuth();
	const { t } = useI18n();
	const { colors } = useTheme();
	const styles = createStyles(colors);
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
			setError(t('login_error_generic'));
		} finally {
			setPending(false);
		}
	};

	if (isLoading) {
		return (
			<View style={styles.center}>
				<ActivityIndicator size="large" color="#0080FF" />
				<Text style={styles.loadingText}>{t('common_loading')}</Text>
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
					placeholder={t('login_name_placeholder')}
					value={nom}
					placeholderTextColor={colors.textSoft}
					autoCapitalize="none"
					onChangeText={setNom}
				/>
				<TextInput
					style={styles.input}
					placeholder={t('login_password_placeholder')}
					value={mdp}
					placeholderTextColor={colors.textSoft}
					secureTextEntry
					onChangeText={setMdp}
				/>

				{error ? <Text style={styles.error}>{error}</Text> : null}

				<TouchableOpacity style={styles.button} onPress={handleConnexion} disabled={pending}>
					<Text style={styles.buttonText}>{pending ? t('login_connecting') : t('login_connect')}</Text>
				</TouchableOpacity>

				<Text style={styles.hint}>{t('login_hint')}</Text>
			</View>

			<Text style={styles.footer}>Samuel Bélanger && Jérémy Boucher</Text>
		</KeyboardAvoidingView>
	);
}

function createStyles(colors) {
	return StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: colors.background,
			justifyContent: 'space-between',
			paddingVertical: 40,
			paddingBottom: 20,
			paddingHorizontal: 20,
		},
		center: {
			flex: 1,
			alignItems: 'center',
			justifyContent: 'center',
			backgroundColor: colors.background,
		},
		loadingText: {
			marginTop: 10,
			color: colors.text,
		},
		card: {
			marginTop: 40,
			backgroundColor: colors.surface,
			borderRadius: 16,
			padding: 20,
			shadowColor: '#000080',
			shadowOpacity: 0.3,
			shadowRadius: 12,
			elevation: 6,
			borderWidth: 1,
			borderColor: colors.border,
		},
		company: {
			fontSize: 28,
			fontWeight: '800',
			color: colors.primary,
			textAlign: 'center',
			marginBottom: 12,
		},
		image: {
			width: '100%',
			height: 140,
			marginBottom: 18,
			borderRadius: 16,
			alignSelf: 'center',
			resizeMode: 'contain',
		},
		input: {
			borderWidth: 2,
			borderColor: colors.border,
			borderRadius: 10,
			paddingHorizontal: 12,
			paddingVertical: 10,
			marginBottom: 10,
			backgroundColor: colors.surfaceAlt,
			color: colors.text,
		},
		error: {
			color: colors.danger,
			marginBottom: 8,
			textAlign: 'center',
		},
		button: {
			backgroundColor: colors.primary,
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
			color: colors.textSoft,
			fontSize: 12,
		},
		footer: {
			textAlign: 'center',
			color: colors.text,
			fontWeight: '600',
			fontSize: 16,
			marginBottom: 50,
		},
	});
}

