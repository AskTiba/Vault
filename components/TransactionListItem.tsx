import { View, Text } from 'react-native';
import React from 'react';
import { Category, Transaction } from '~/types';
import Card from './UI/Card';

interface TransactionListItemProps {
  transaction: Transaction;
  categoryInfo: Category | undefined;
}

export default function TransactionListItem({
  transaction,
  categoryInfo,
}: TransactionListItemProps) {
  return (
    <View>
      <Card>
        <Text>
          {categoryInfo?.name} amount: {transaction.amount}
        </Text>
      </Card>
    </View>
  );
}
