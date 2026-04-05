@echo off
chcp 65001 >nul
echo ========================================
echo    EEDC - Setup du projet React
echo ========================================
echo.

:: ---- DOSSIERS ----
echo [1/4] Creation des dossiers...
mkdir src\components 2>nul
mkdir src\components\layout 2>nul
mkdir src\components\ui 2>nul
mkdir src\components\sections 2>nul
mkdir src\pages 2>nul
mkdir src\pages\membres 2>nul
mkdir src\pages\admin 2>nul
mkdir src\styles 2>nul
mkdir src\assets 2>nul
mkdir src\hooks 2>nul
mkdir src\context 2>nul
mkdir src\utils 2>nul
mkdir src\data 2>nul
echo    OK - Dossiers crees

:: ---- STYLES ----
echo [2/4] Creation des fichiers de styles...

echo /* ============================================
echo    EEDC - Variables CSS globales
echo    Charte graphique officielle
echo ============================================ */> src\styles\variables.css
echo :root {>> src\styles\variables.css
echo   /* Couleurs principales */>> src\styles\variables.css
echo   --bleu:        #003087;>> src\styles\variables.css
echo   --bleu-dark:   #001f5c;>> src\styles\variables.css
echo   --bleu-light:  #EBF0FF;>> src\styles\variables.css
echo   --or:          #D4A017;>> src\styles\variables.css
echo   --or-light:    #FFF3CD;>> src\styles\variables.css
echo   --vert:        #1A7A4A;>> src\styles\variables.css
echo   --vert-light:  #D4EDDA;>> src\styles\variables.css
echo   --rouge:       #CC0000;>> src\styles\variables.css
echo   /* Neutres */>> src\styles\variables.css
echo   --blanc:       #ffffff;>> src\styles\variables.css
echo   --gris-clair:  #F5F5F5;>> src\styles\variables.css
echo   --gris-moyen:  #D0D0D0;>> src\styles\variables.css
echo   --gris-fonce:  #888888;>> src\styles\variables.css
echo   --texte:       #1A1A2E;>> src\styles\variables.css
echo   --footer-bg:   #001a50;>> src\styles\variables.css
echo   /* Typographie */>> src\styles\variables.css
echo   --font-titre:  'Montserrat', sans-serif;>> src\styles\variables.css
echo   --font-corps:  'Open Sans', sans-serif;>> src\styles\variables.css
echo   /* Espacements */>> src\styles\variables.css
echo   --rayon:       8px;>> src\styles\variables.css
echo   --rayon-lg:    12px;>> src\styles\variables.css
echo   --ombre:       0 4px 24px rgba(0,0,0,0.08);>> src\styles\variables.css
echo   --ombre-lg:    0 8px 40px rgba(0,0,0,0.14);>> src\styles\variables.css
echo   /* Layout */>> src\styles\variables.css
echo   --max-width:   1200px;>> src\styles\variables.css
echo   --nav-height:  70px;>> src\styles\variables.css
echo   /* Transitions */>> src\styles\variables.css
echo   --transition:  0.3s ease;>> src\styles\variables.css
echo }>> src\styles\variables.css

type nul > src\styles\global.css
type nul > src\styles\animations.css
type nul > src\styles\navbar.css
type nul > src\styles\footer.css
type nul > src\styles\hero.css
type nul > src\styles\buttons.css
type nul > src\styles\cards.css
type nul > src\styles\forms.css
type nul > src\styles\admin.css
type nul > src\styles\membres.css
echo    OK - Styles crees

:: ---- COMPOSANTS ----
echo [3/4] Creation des composants...

:: Layout
type nul > src\components\layout\Navbar.jsx
type nul > src\components\layout\Footer.jsx
type nul > src\components\layout\Layout.jsx
type nul > src\components\layout\PrivateRoute.jsx
type nul > src\components\layout\AdminRoute.jsx
type nul > src\components\layout\ScrollToTop.jsx

:: UI
type nul > src\components\ui\Button.jsx
type nul > src\components\ui\Badge.jsx
type nul > src\components\ui\Card.jsx
type nul > src\components\ui\Modal.jsx
type nul > src\components\ui\Loader.jsx
type nul > src\components\ui\Toast.jsx
type nul > src\components\ui\SectionLabel.jsx

:: Sections (blocs réutilisables de pages)
type nul > src\components\sections\HeroAccueil.jsx
type nul > src\components\sections\StatsBar.jsx
type nul > src\components\sections\BranchesApercu.jsx
type nul > src\components\sections\ActusApercu.jsx
type nul > src\components\sections\Temoignages.jsx
type nul > src\components\sections\CtaBand.jsx
type nul > src\components\sections\PageHero.jsx

:: ---- PAGES ----
:: Pages publiques
type nul > src\pages\Accueil.jsx
type nul > src\pages\QuiSommesNous.jsx
type nul > src\pages\Branches.jsx
type nul > src\pages\Louveteaux.jsx
type nul > src\pages\Eclaireurs.jsx
type nul > src\pages\Pionniers.jsx
type nul > src\pages\Routiers.jsx
type nul > src\pages\Rejoindre.jsx
type nul > src\pages\Actualites.jsx
type nul > src\pages\Article.jsx
type nul > src\pages\Galerie.jsx
type nul > src\pages\Contact.jsx
type nul > src\pages\NotFound.jsx

:: Pages membres
type nul > src\pages\membres\Login.jsx
type nul > src\pages\membres\Dashboard.jsx
type nul > src\pages\membres\Ressources.jsx
type nul > src\pages\membres\Calendrier.jsx
type nul > src\pages\membres\Annonces.jsx
type nul > src\pages\membres\MonProfil.jsx

:: Pages admin
type nul > src\pages\admin\AdminDashboard.jsx
type nul > src\pages\admin\AdminArticles.jsx
type nul > src\pages\admin\AdminArticleEdit.jsx
type nul > src\pages\admin\AdminGalerie.jsx
type nul > src\pages\admin\AdminInscriptions.jsx
type nul > src\pages\admin\AdminAgenda.jsx
type nul > src\pages\admin\AdminRessources.jsx
type nul > src\pages\admin\AdminUtilisateurs.jsx
type nul > src\pages\admin\AdminUtilisateurEdit.jsx

echo    OK - Composants et pages crees

:: ---- UTILITAIRES ----
echo [4/4] Creation des utilitaires...

:: Context
type nul > src\context\AuthContext.jsx
type nul > src\context\ToastContext.jsx

:: Hooks
type nul > src\hooks\useAuth.js
type nul > src\hooks\useApi.js
type nul > src\hooks\useScrollReveal.js
type nul > src\hooks\useLocalStorage.js

:: Utils
type nul > src\utils\api.js
type nul > src\utils\auth.js
type nul > src\utils\formatDate.js
type nul > src\utils\constants.js

:: Data (données statiques temporaires avant backend)
type nul > src\data\branches.js
type nul > src\data\temoignages.js
type nul > src\data\articles.js
type nul > src\data\equipe.js

echo    OK - Utilitaires crees
echo.
echo ========================================
echo    Setup termine avec succes !
echo.
echo    Structure creee :
echo    - 7 dossiers src/
echo    - 10 fichiers CSS
echo    - 7 composants layout
echo    - 7 composants UI
echo    - 7 sections
echo    - 13 pages publiques
echo    - 6 pages membres
echo    - 9 pages admin
echo    - 4 context/hooks/utils
echo ========================================
pause
