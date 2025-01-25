import React from 'react';
import { StyleSheet, View } from 'react-native';

import { ActivityIndicator, List } from 'react-native-paper';
import { useContact } from '../../hooks/query/other-query';
import { SingleContact } from './SingleContact';

export const Contact = () => {
  // const { data: ContactData, isLoading } = useContact();

  return (
    <View style={styles.content1}>
      <List.Accordion
        title="EMERGENCY CONTACTS"
        style={styles.accordion1}
        titleStyle={styles.accordionTitle1}
        id={1}
        theme={{colors: {background: 'transparent'}}}
        right={props => (
          <List.Icon
            {...props}
            icon={props.isExpanded ? 'chevron-up' : 'chevron-down'}
            color="#FFFFFF"
          />
        )}>
        <View style={styles.accordionAnswer}>
          {isLoading ? (
            <ActivityIndicator
              animating={true}
              color="#4E8FB4"
              size="small"
              style={{ marginTop: 20 }}
            />
          ) : (
            ContactData?.data.map(contact => (
              <SingleContact
                key={contact.name}
                name={contact.name}
                phone={contact.phone}
                email={contact.email}
                image={contact.image}
              />
            ))
          )}
        </View>
      </List.Accordion>
    </View>
  );
};

const styles = StyleSheet.create({
  accordion1: {
    // backgroundColor: "#05020E",
  },
  content1: {
    // backgroundColor: '#222324',
  },
  accordionTitle1: {
    color: '#FFFFFF',
    fontFamily: 'ProximaBold',
    fontSize: 16,
    lineHeight: 18,
  },
  accordionAnswer: {
    paddingVertical: 10,
  },
});
