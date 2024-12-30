import { Stack, Link } from 'expo-router';
import '../global.css';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Category, Transaction } from '~/types';
import { useSQLiteContext } from 'expo-sqlite';
import TransactionList from '~/components/TransactionList';
import { ScrollView } from 'react-native';

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const db = useSQLiteContext();

  useEffect(() => {
    db.withTransactionAsync(async () => {
      await getData();
    });
  }, [db]);

  async function getData() {
    const result = await db.getAllAsync<Transaction>(
      'SELECT * from Transactions ORDER BY date DESC;'
    );
    setTransactions(result);
    const categoriesResult = await db.getAllAsync<Category>('SELECT * from Categories;');
    setCategories(categoriesResult);
  }

  async function deleteTransaction(id: number) {
    db.withTransactionAsync(async () => {
      await db.runAsync(`DELETE FROM Transactions WHERE id = ?;`[id]);
      await getData();
    });
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Vault',
          headerLargeTitle: true,
          headerTitleStyle: {
            fontFamily: 'RubikMaze-Regular',
            fontSize: 24,
            fontWeight: 700,
          },
        }}
      />
      <ScrollView contentContainerStyle={{ padding: 15, paddingVertical: 20 }} className="">
        <TransactionList
          categories={categories}
          transactions={transactions}
          deleteTransaction={deleteTransaction}
        />
      </ScrollView>
      <StatusBar style="auto" />
    </>
  );
}
