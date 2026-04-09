import { AppPressable } from '@/shared/presentation/components/ui/app-pressable';
import { useThemeColors } from '@/shared/presentation/hooks/use-app-theme';
import { Bookmark } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

interface SaveListFormProps {
  onSave: (name: string, storeName: string) => void;
  initialName?: string;
  initialStoreName?: string;
}

export const SaveListForm = React.memo(function SaveListForm({
  onSave,
  initialName,
  initialStoreName,
}: SaveListFormProps) {
  const colors = useThemeColors();
  const [listName, setListName] = useState(initialName ?? '');
  const [storeName, setStoreName] = useState(initialStoreName ?? '');

  const handleSave = useCallback(() => {
    const trimmedName = listName.trim();
    const trimmedStore = storeName.trim();

    if (!trimmedName) return;

    onSave(trimmedName, trimmedStore);
  }, [listName, storeName, onSave]);

  const isValid = listName.trim().length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.inputsColumn}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.backgroundTertiary,
              color: colors.textOnSurface,
            },
          ]}
          placeholder='Nombre de la lista'
          placeholderTextColor={colors.textTertiary}
          value={listName}
          onChangeText={setListName}
          autoCorrect={false}
          autoCapitalize='sentences'
          returnKeyType='next'
          autoFocus
        />
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.backgroundTertiary,
              color: colors.textOnSurface,
            },
          ]}
          placeholder='Establecimiento'
          placeholderTextColor={colors.textTertiary}
          value={storeName}
          onChangeText={setStoreName}
          autoCorrect={false}
          autoCapitalize='sentences'
          returnKeyType='done'
          onSubmitEditing={handleSave}
        />
      </View>
      <AppPressable
        onPress={handleSave}
        disabled={!isValid}
        style={[
          styles.saveButton,
          {
            backgroundColor: isValid
              ? colors.primary
              : colors.backgroundTertiary,
          },
        ]}
      >
        <Bookmark
          size={26}
          color={isValid ? colors.textInverse : colors.textTertiary}
        />
      </AppPressable>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  inputsColumn: {
    flex: 1,
    gap: 8,
  },
  input: {
    height: 46,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    fontWeight: '500',
  },
  saveButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
