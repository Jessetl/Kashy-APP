import { AppPressable } from '@/shared/presentation/components/ui/app-pressable';
import { useAppTheme } from '@/shared/presentation/hooks/use-app-theme';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  DollarSign,
  Globe,
  ShieldCheck,
  ShoppingBag,
  Wallet,
  Zap,
} from 'lucide-react-native';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  colors: ReturnType<typeof useAppTheme>['colors'];
}

const FeatureCard = React.memo(function FeatureCard({
  icon,
  title,
  description,
  colors,
}: FeatureCardProps) {
  return (
    <View
      style={[
        aStyles.featureCard,
        { backgroundColor: colors.backgroundSecondary },
      ]}
    >
      <View
        style={[aStyles.featureIcon, { backgroundColor: colors.primaryLight }]}
      >
        {icon}
      </View>
      <Text style={[aStyles.featureTitle, { color: colors.textOnSurface }]}>
        {title}
      </Text>
      <Text style={[aStyles.featureDesc, { color: colors.textSecondary }]}>
        {description}
      </Text>
    </View>
  );
});

export default function AboutScreen() {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <ScrollView
      style={aStyles.container}
      contentContainerStyle={[
        aStyles.content,
        { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 40 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={aStyles.header}>
        <AppPressable onPress={() => router.back()} style={aStyles.backBtn}>
          <ArrowLeft pointerEvents='none' size={22} color={colors.text} />
        </AppPressable>
        <Text style={[aStyles.headerTitle, { color: colors.text }]}>
          Acerca de
        </Text>
        <View style={aStyles.backBtn} />
      </View>

      {/* Hero */}
      <View style={aStyles.heroSection}>
        <View
          style={[aStyles.heroLogo, { backgroundColor: colors.primaryLight }]}
        >
          <Text style={[aStyles.heroLogoText, { color: colors.primary }]}>
            K
          </Text>
        </View>
        <Text style={[aStyles.heroName, { color: colors.text }]}>Kashy</Text>
        <Text style={[aStyles.heroTagline, { color: colors.textSecondary }]}>
          Tu aliado financiero del dia a dia
        </Text>
      </View>

      {/* Description */}
      <View
        style={[
          aStyles.descCard,
          { backgroundColor: colors.backgroundSecondary },
        ]}
      >
        <Text style={[aStyles.descText, { color: colors.textOnSurface }]}>
          Kashy nacio para resolver un problema real: llevar el control de tus
          compras en un pais donde los precios cambian constantemente. Convierte
          entre moneda local y dolares al instante, organiza tus listas de
          supermercado y mantiene tus deudas en orden — todo desde un solo
          lugar.
        </Text>
      </View>

      {/* Features grid */}
      <View style={aStyles.section}>
        <Text style={[aStyles.sectionTitle, { color: colors.textTertiary }]}>
          LO QUE PUEDES HACER
        </Text>
        <View style={aStyles.featuresGrid}>
          <FeatureCard
            icon={<ShoppingBag size={20} color={colors.primary} />}
            title='Listas inteligentes'
            description='Crea listas con precios en Bs y ve el total en USD al instante'
            colors={colors}
          />
          <FeatureCard
            icon={<DollarSign size={20} color={colors.primary} />}
            title='Tasa en tiempo real'
            description='Conversion automatica con la tasa del dia actualizada'
            colors={colors}
          />
          <FeatureCard
            icon={<Wallet size={20} color={colors.primary} />}
            title='Control de deudas'
            description='Organiza lo que debes y lo que te deben con recordatorios'
            colors={colors}
          />
          <FeatureCard
            icon={<Zap size={20} color={colors.primary} />}
            title='Modo rapido'
            description='Usa la app sin cuenta. Registrate cuando quieras guardar'
            colors={colors}
          />
          <FeatureCard
            icon={<Globe size={20} color={colors.primary} />}
            title='Multi-mercado'
            description='Pensada para Venezuela, Argentina, Chile y Peru'
            colors={colors}
          />
          <FeatureCard
            icon={<ShieldCheck size={20} color={colors.primary} />}
            title='Tus datos seguros'
            description='Autenticacion con Firebase y datos encriptados en transito'
            colors={colors}
          />
        </View>
      </View>

      {/* Footer */}
      <View style={aStyles.footer}>
        <Text style={[aStyles.footerVersion, { color: colors.textTertiary }]}>
          Version 1.0.0
        </Text>
        <Text style={[aStyles.footerCopy, { color: colors.textTertiary }]}>
          Hecho con cariño para Latinoamerica
        </Text>
      </View>
    </ScrollView>
  );
}

const aStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    gap: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  heroSection: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  heroLogo: {
    width: 80,
    height: 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  heroLogoText: {
    fontSize: 40,
    fontWeight: '800',
  },
  heroName: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  heroTagline: {
    fontSize: 15,
    fontWeight: '400',
    textAlign: 'center',
  },
  descCard: {
    borderRadius: 16,
    padding: 18,
  },
  descText: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 23,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    paddingHorizontal: 4,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  featureCard: {
    width: '48%',
    flexGrow: 1,
    borderRadius: 14,
    padding: 14,
    gap: 8,
  },
  featureIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  featureDesc: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 17,
  },
  footer: {
    alignItems: 'center',
    gap: 4,
    paddingTop: 8,
  },
  footerVersion: {
    fontSize: 13,
    fontWeight: '600',
  },
  footerCopy: {
    fontSize: 12,
    fontWeight: '400',
  },
});
