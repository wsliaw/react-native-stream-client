/**
 * @format
 */

import React from 'react';
import {Button, View} from 'react-native';

const URL = 'http://localhost:3000';

function App(): JSX.Element {
  function stream() {
    const options = {reactNative: {textStreaming: true}};

    fetch(URL, options).then(res => {
      const reader = res.body.getReader(),
        objects = [];

      let object = '';

      read();

      function read() {
        reader
          .read()
          .then(({done, value}) => {
            const val = new TextDecoder().decode(new Uint8Array(value));

            if (object) {
              object += val;

              const list = object.split('\n');

              object = '';

              list.forEach(item => {
                if (item) {
                  if (item.endsWith('}')) {
                    objects.push(JSON.parse(item));
                  } else {
                    object += item;
                  }
                }
              });
            } else {
              object = val;
            }

            if (!done) {
              read();
            } else {
              console.log('results: ', objects);
            }
          })
          .catch(err => {
            console.log('read.err', err);
          });
      }
    });
  }

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Button title="stream" onPress={stream} />
    </View>
  );
}

export default App;
