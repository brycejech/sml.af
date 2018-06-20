
# Setup PM2

PM2 is used to spawn and monitor the application, handle standard out and standard error, manage environments and environment variables, restart application on crashes, and start application on boot.

Install pm2 globally with npm

```bash
$ npm i -g pm2
```

Create a config file in project root dir called `pm2.config.js`

```js
module.exports =
{
    name:           'sml.af',
    script:         './index.js',
    watch:          true,
    ignore_watch:  ['logs/'],
    error_file:     'logs/err.log',
    out_file:       'logs/std_out.log',
    combine_logs:   true,
    env: {
        'NODE_ENV': 'development',
    },
    env_production : {
        'NODE_ENV': 'production'
    }
}
```

*Config file will contain secrets, be sure to add this to your `.gitignore` file:* `pm2.config.js`

Start app with pm2

```bash
# In test
$ pm2 start pm2.config.js

# In production
$ pm2 start pm2.config.js --env production
```

Reload environment vars for a running app

```bash
$ pm2 restart pm2.config.js --update-env

# OR
$ pm2 startOrReload pm2.config.js --update-env

# OR
$ pm2 restart <app name or ID> --update-env

# OR
$ pm2 startOrReload <app name or ID> --update-env
```

Generate a startup script. Will automagically resurrect the process list as it was when startup script was generated if server unexpectedly restarts.

```bash
$ pm2 startup
```

Disable startup script

```bash
$ pm2 unstartup
```

Save the current process list. After starting all the apps you want to manage, can save the list in the event of unexpected server restart like so:

```bash
$ pm2 save
```

Then, can resurrect from the list like so:

```bash
$ pm2 resurrect
```
