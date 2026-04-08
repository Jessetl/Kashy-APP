import { useThemeColors } from '@/shared/presentation/hooks/use-app-theme';
import { Bookmark, Folder, Share2, Trash2 } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

interface ListHeaderBarProps {
  onShare?: () => void;
  onSave?: () => void;
  onOpenSavedLists?: () => void;
  onDelete?: () => void;
}

export const ListHeaderBar = React.memo(function ListHeaderBar({
  onShare,
  onSave,
  onOpenSavedLists,
  onDelete,
}: ListHeaderBarProps) {
  const colors = useThemeColors();
  const iconColor = colors.text;

  return (
    <View style={styles.container}>
      <View style={styles.rightActions}>
        {onShare && (
          <Pressable onPress={onShare} hitSlop={8} style={styles.iconButton}>
            <Share2 size={20} color={iconColor} />
          </Pressable>
        )}
        {onSave && (
          <Pressable onPress={onSave} hitSlop={8} style={styles.iconButton}>
            <Bookmark size={20} color={iconColor} />
          </Pressable>
        )}
        {onOpenSavedLists && (
          <Pressable onPress={onOpenSavedLists} hitSlop={8} style={styles.iconButton}>
            <Folder size={20} color={iconColor} />
          </Pressable>
        )}
        {onDelete && (
          <Pressable onPress={onDelete} hitSlop={8} style={styles.iconButton}>
            <Trash2 size={20} color={iconColor} />
          </Pressable>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    height: 48,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconButton: {
    padding: 4,
  },
});
