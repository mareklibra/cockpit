import cockpit from 'base1/cockpit';

export function spawnProcess ({ cmd, args = [], stdin}) {
  const spawnArgs = [cmd, ...args];
  console.log(`spawn process args: ${spawnArgs}`);

  return spawn(cockpit.spawn(spawnArgs).input(stdin))
    .fail((ex, data) =>
      console.error(`spawn '${cmd}' process error: "${JSON.stringify(ex)}", data: "${JSON.stringify(data)}"`))
}

export function spawnScript ({ script }) {
  const spawnArgs = [script];
  console.log(`spawn script args: ${spawnArgs}`);

  return spawn(cockpit.script(spawnArgs))
    .fail((ex, data) =>
      console.error(`spawn '${script}' script error: "${JSON.stringify(ex)}", data: "${JSON.stringify(data)}"`))
}

function spawn (command) {
  const deferred = cockpit.defer();
  let stdout = '';
  command
    .stream(chunk => {
      stdout += chunk;
    })
    .done(() => {
      deferred.resolve(stdout)
    })
    .fail((ex, data) => {
      deferred.reject(ex, data);
    });

  return deferred.promise;
}
