import { AppPressable } from '@/shared/presentation/components/ui/app-pressable';
import { useAppTheme } from '@/shared/presentation/hooks/use-app-theme';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Bell,
  CalendarClock,
  ShoppingBag,
  TrendingUp,
} from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface NotifToggleProps {
  icon: React.ReactNode;
  label: string;
  description: string;
  value: boolean;
  onToggle: (v: boolean) => void;
  colors: ReturnType<typeof useAppTheme>['colors'];
}

const NotifToggle = React.memo(function NotifToggle({
  icon,
  label,
  description,
  value,
  onToggle,
  colors,
}: NotifToggleProps) {
  return (
    <View style={nStyles.row}>
      <View
        style={[nStyles.iconWrap, { backgroundColor: colors.primaryLight }]}
      >
        {icon}
      </View>
      <View style={nStyles.textCol}>
        <Text style={[nStyles.label, { color: colors.textOnSurface }]}>
          {label}
        </Text>
        <Text style={[nStyles.desc, { color: colors.textTertiary }]}>
          {description}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{
          false: colors.backgroundTertiary,
          true: colors.primary,
        }}
        thumbColor='#FFFFFF'
      />
    </View>
  );
});

export default function NotificationsScreen() {
  const { colors } = useAppTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [pushEnabled, setPushEnabled] = useState(true);
  const [debtReminders, setDebtReminders] = useState(true);
  const [priceAlerts, setPriceAlerts] = useState(false);
  const [listReminders, setListReminders] = useState(true);

  const handleTogglePush = useCallback((v: boolean) => {
    setPushEnabled(v);
    if (!v) {
      setDebtReminders(false);
      setPriceAlerts(false);
      setListReminders(false);
    }
  }, []);

  return (
    <ScrollView
      style={nStyles.container}
      contentContainerStyle={[
        nStyles.content,
        { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 40 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={nStyles.header}>
        <AppPressable onPress={() => router.back()} style={nStyles.backBtn}>
          <ArrowLeft pointerEvents='none' size={22} color={colors.text} />
        </AppPressable>
        <Text style={[nStyles.headerTitle, { color: colors.text }]}>
          Notificaciones
        </Text>
        <View style={nStyles.backBtn} />
      </View>

      {/* Push master toggle */}
      <View style={nStyles.section}>
        <Text style={[nStyles.sectionTitle, { color: colors.textTertiary }]}>
          GENERAL
        </Text>
        <View
          style={[
            nStyles.card,
            { backgroundColor: colors.backgroundSecondary },
          ]}
        >
          <NotifToggle
            icon={<Bell size={18} color={colors.primary} />}
            label='Notificaciones push'
            description='Recibe alertas en tu dispositivo'
            value={pushEnabled}
            onToggle={handleTogglePush}
            colors={colors}
          />
        </View>
      </View>

      {/* Category toggles */}
      <View style={nStyles.section}>
        <Text style={[nStyles.sectionTitle, { color: colors.textTertiary }]}>
          CATEGORIAS
        </Text>
        <View
          style={[
            nStyles.card,
            { backgroundColor: colors.backgroundSecondary },
          ]}
        >
          <NotifToggle
            icon={<CalendarClock size={18} color={colors.primary} />}
            label='Recordatorios de deudas'
            description='Aviso antes del vencimiento de pagos'
            value={debtReminders}
            onToggle={setDebtReminders}
            colors={colors}
          />
          <View
            style={[nStyles.separator, { backgroundColor: colors.border }]}
          />
          <NotifToggle
            icon={<TrendingUp size={18} color={colors.primary} />}
            label='Alertas de precios'
            description='Cambios en la tasa de cambio'
            value={priceAlerts}
            onToggle={setPriceAlerts}
            colors={colors}
          />
          <View
            style={[nStyles.separator, { backgroundColor: colors.border }]}
          />
          <NotifToggle
            icon={<ShoppingBag size={18} color={colors.primary} />}
            label='Listas de compras'
            description='Recordatorios de listas pendientes'
            value={listReminders}
            onToggle={setListReminders}
            colors={colors}
          />
        </View>
      </View>

      {/* Info note */}
      <Text style={[nStyles.infoNote, { color: colors.textTertiary }]}>
        Las notificaciones push requieren permisos del sistema. Si no recibes
        alertas, revisa los ajustes de tu dispositivo.
      </Text>
    </ScrollView>
  );
}

const nStyles = StyleSheet.create({
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
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    paddingHorizontal: 4,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    gap: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
  },
  desc: {
    fontSize: 12,
    fontWeight: '400',
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 48,
  },
  infoNote: {
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 12,
  },
});
