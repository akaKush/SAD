# Videochat

Aquesta és la carpeta del projecte de lliure elecció de l'assignatura SAD.

En el nostre cas hem decidit crear un videochat amb Meteor.

---

<h2>Passos</h2>

Comencem instal·lant Meteor al nostre ordinador. Simplement seguint els passos de la web oficial de Meteor (https://www.meteor.com/install)
<br><br>

Un cop instalat, entrem al nostre repositori de SAD i creem una carpeta exclusiva per aquest projecte, on executem els següents comandos:

```
meteor create videochat_app
cd videochat
meteor add elmarti:video-chat accounts-ui accounts-password twbs:bootstrap
meteor remove autopublish insecure
```

En cas que ens doni algun error seguim els passos que ens indica al terminal.
Hem afegit els paquets accounts-ui i bootstrap per facilitar la interficie gràfica i no perdre-hi massa temps.

Els autopublish i insecure son paquets que Meteor fa servir per fer el procés de prototyping més fàcil però fan l'app insegura, i no són necessaris en el nostre cas.


Abans de començar a construir el core de la app definim els estils que ens interessen.
Obrim un editor de textos i a dins la carpeta de la nostre app trobarem un altre directori anomenat client, on tenim els 3 fitxers **main** de la nostre app: `main.css`, `main.html` i `main.js`.

Comencem amb la UI de la app definint els estils al main.css:

```
body {
    padding-top: 50px;
}
video {
    width: 80%;
    background: black;
}
.app-body {
    padding: 40px 15px;
    text-align: center;
}
#login-buttons {
    padding-top: 17px;
}
.online {
    color: green;
    cursor: pointer;
}
.offline {
    color: red;
    cursor: not-allowed;
}
@media (max-width: 768px) {
     #navbar {
        overflow-y: initial;
    }
    #login-buttons{
        padding:0px 17px;
    }
}
```

Ara que ja tenim els estils definits fem un **build** de la app executant al terminal `meteor`. Anem a localhost al nostre navegador i veiem com ja s'està executant la nostre app.

Per començar a fer algun primer canvi i visualitzar-lo millor, buidem l'actual fitxer `main.html`, que ens proporciona el framework directament, i el canviem per una barra de navegació a la part superior i un **Sign in**, on podrem entrar al nostre usuari:

```
<head>
  <title>Video Chat</title>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
<nav class="navbar navbar-inverse navbar-fixed-top">
    <div class="container">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
        <a class="navbar-brand" href="#">Meteor Video Chat</a>
      </div>
      <div id="navbar" class="collapse navbar-collapse">
        <ul class="nav navbar-nav">
          <li>{{>loginButtons}}</li>
        </ul>
      </div>
    </div>
  </nav>
</body>
```

Afegim el següent codi a sota del closing tag </nav>:
```
<div class="container">
    <div class="app-body">
      {{#if currentUser}} {{> dashboard}} {{else}}
      <h1>Please log in</h1>
      {{/if}}
    </div>
  </div>
```
