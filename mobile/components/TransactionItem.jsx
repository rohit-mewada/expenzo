import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { styles } from '@/assets/styles/home.styles';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { formatDate } from "../lib/utils";

/**
 * Map categories to their respective icons.
 */
const CATEGORY_ICONS = {
  "Food & Drinks": "fast-food",
  "Shopping": "cart",
  "Transportation": "car",
  "Entertainment": "film",
  "Bills": "receipt",
  "Income": "cash",
  "Other": "ellipsis-horizontal"
};

/**
 * Transaction item component.
 * @param {object} props
 * @param {object} props.item - Transaction object.
 * @param {function} props.onDelete - Delete handler.
 */
const TransactionItem = ({ item, onDelete }) => {
  const isIncome = parseFloat(item.amount) > 0;
  // Fix typo in category mapping
  const iconName = CATEGORY_ICONS[item.category] || "pricetag-outline";

  return (
    <View style={styles.transactionCard} key={item.id}>
      <TouchableOpacity style={styles.transactionContent} activeOpacity={0.8}>
        <View style={styles.categoryIconContainer}>
          <Ionicons name={iconName} size={22} color={isIncome ? COLORS.income : COLORS.expense} />
        </View>
        <View style={styles.transactionLeft}>
          <Text style={styles.transactionTitle}>{item.title}</Text>
          <Text style={styles.transactionCategory}>{item.category}</Text>
        </View>
        <View style={styles.transactionRight}>
          <Text style={[styles.transactionAmount, { color: isIncome ? COLORS.income : COLORS.expense }]}>
            {isIncome ? "+" : "-"}${Math.abs(parseFloat(item.amount)).toFixed(2)}
          </Text>
          <Text style={styles.transactionDate}>{formatDate(item.created_at)}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(item.id)} accessibilityLabel="Delete transaction">
        <Ionicons name="trash-outline" size={20} color={COLORS.expense} />
      </TouchableOpacity>
    </View>
  );
};

export default TransactionItem;