'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">nestjs-auth-template documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search">
    <input type="text" placeholder="Type to search">
    <button type="button"
        class="search-input-clear"
        aria-label="Clear search"
        data-search-input-clear>&times;</button>
</div>
` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                                <li class="link">
                                    <a href="overview.html" data-type="chapter-link">
                                        <span class="icon ion-ios-keypad"></span>Overview
                                    </a>
                                </li>

                            <li class="link">
                                <a href="index.html" data-type="chapter-link">
                                    <span class="icon ion-ios-paper"></span>
                                        README
                                </a>
                            </li>
                                <li class="link">
                                    <a href="architecture.html" data-type="chapter-link">
                                        <span class="icon ion-ios-git-branch"></span>Architecture
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>

                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AppModule-9bc1f98729adaaf713c8571133952694772f78bdc3cb10be07bbd5d1ff020a0620d8d018f8c0da569d20baa347ff636f80a20b5513758f920e86453eb8ea0bc8"' : 'data-bs-target="#xs-controllers-links-module-AppModule-9bc1f98729adaaf713c8571133952694772f78bdc3cb10be07bbd5d1ff020a0620d8d018f8c0da569d20baa347ff636f80a20b5513758f920e86453eb8ea0bc8"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-9bc1f98729adaaf713c8571133952694772f78bdc3cb10be07bbd5d1ff020a0620d8d018f8c0da569d20baa347ff636f80a20b5513758f920e86453eb8ea0bc8"' :
                                            'id="xs-controllers-links-module-AppModule-9bc1f98729adaaf713c8571133952694772f78bdc3cb10be07bbd5d1ff020a0620d8d018f8c0da569d20baa347ff636f80a20b5513758f920e86453eb8ea0bc8"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppModule-9bc1f98729adaaf713c8571133952694772f78bdc3cb10be07bbd5d1ff020a0620d8d018f8c0da569d20baa347ff636f80a20b5513758f920e86453eb8ea0bc8"' : 'data-bs-target="#xs-injectables-links-module-AppModule-9bc1f98729adaaf713c8571133952694772f78bdc3cb10be07bbd5d1ff020a0620d8d018f8c0da569d20baa347ff636f80a20b5513758f920e86453eb8ea0bc8"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-9bc1f98729adaaf713c8571133952694772f78bdc3cb10be07bbd5d1ff020a0620d8d018f8c0da569d20baa347ff636f80a20b5513758f920e86453eb8ea0bc8"' :
                                        'id="xs-injectables-links-module-AppModule-9bc1f98729adaaf713c8571133952694772f78bdc3cb10be07bbd5d1ff020a0620d8d018f8c0da569d20baa347ff636f80a20b5513758f920e86453eb8ea0bc8"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtProvider.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtProvider</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthenticationModule.html" data-type="entity-link" >AuthenticationModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AuthenticationModule-1d9a9bb8993b488662739059d920bd1bd2127b37bb991bfdd0ab7f9428d3ac708f739a3526eaa1c4cbb11f3a70a39d57140e091cf7e0054a92ff3af685169c0d"' : 'data-bs-target="#xs-controllers-links-module-AuthenticationModule-1d9a9bb8993b488662739059d920bd1bd2127b37bb991bfdd0ab7f9428d3ac708f739a3526eaa1c4cbb11f3a70a39d57140e091cf7e0054a92ff3af685169c0d"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthenticationModule-1d9a9bb8993b488662739059d920bd1bd2127b37bb991bfdd0ab7f9428d3ac708f739a3526eaa1c4cbb11f3a70a39d57140e091cf7e0054a92ff3af685169c0d"' :
                                            'id="xs-controllers-links-module-AuthenticationModule-1d9a9bb8993b488662739059d920bd1bd2127b37bb991bfdd0ab7f9428d3ac708f739a3526eaa1c4cbb11f3a70a39d57140e091cf7e0054a92ff3af685169c0d"' }>
                                            <li class="link">
                                                <a href="controllers/AuthenticationController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthenticationController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuthenticationModule-1d9a9bb8993b488662739059d920bd1bd2127b37bb991bfdd0ab7f9428d3ac708f739a3526eaa1c4cbb11f3a70a39d57140e091cf7e0054a92ff3af685169c0d"' : 'data-bs-target="#xs-injectables-links-module-AuthenticationModule-1d9a9bb8993b488662739059d920bd1bd2127b37bb991bfdd0ab7f9428d3ac708f739a3526eaa1c4cbb11f3a70a39d57140e091cf7e0054a92ff3af685169c0d"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthenticationModule-1d9a9bb8993b488662739059d920bd1bd2127b37bb991bfdd0ab7f9428d3ac708f739a3526eaa1c4cbb11f3a70a39d57140e091cf7e0054a92ff3af685169c0d"' :
                                        'id="xs-injectables-links-module-AuthenticationModule-1d9a9bb8993b488662739059d920bd1bd2127b37bb991bfdd0ab7f9428d3ac708f739a3526eaa1c4cbb11f3a70a39d57140e091cf7e0054a92ff3af685169c0d"' }>
                                        <li class="link">
                                            <a href="injectables/AuthenticationService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthenticationService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/BcryptProvider.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BcryptProvider</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtProvider.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtProvider</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/RedisModule.html" data-type="entity-link" >RedisModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-RedisModule-eea8908a245996eb723fe3394809702266683b8ff0394e1ddfcb92417525357ebadfb81a58c23e9cb4b048e9ba155ac39b3ebb0af03f8593e8079f70fe1f33d9"' : 'data-bs-target="#xs-injectables-links-module-RedisModule-eea8908a245996eb723fe3394809702266683b8ff0394e1ddfcb92417525357ebadfb81a58c23e9cb4b048e9ba155ac39b3ebb0af03f8593e8079f70fe1f33d9"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-RedisModule-eea8908a245996eb723fe3394809702266683b8ff0394e1ddfcb92417525357ebadfb81a58c23e9cb4b048e9ba155ac39b3ebb0af03f8593e8079f70fe1f33d9"' :
                                        'id="xs-injectables-links-module-RedisModule-eea8908a245996eb723fe3394809702266683b8ff0394e1ddfcb92417525357ebadfb81a58c23e9cb4b048e9ba155ac39b3ebb0af03f8593e8079f70fe1f33d9"' }>
                                        <li class="link">
                                            <a href="injectables/RedisService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RedisService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UsersModule.html" data-type="entity-link" >UsersModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-UsersModule-c9727de31eaf725f647f6f9fa1da0f0d8d5579e081b2831412acc211362d68f8de6228088c7ed00dcd400ac9cc83e6e5212c93ce5c8c236b71c4b481aa660ab2"' : 'data-bs-target="#xs-controllers-links-module-UsersModule-c9727de31eaf725f647f6f9fa1da0f0d8d5579e081b2831412acc211362d68f8de6228088c7ed00dcd400ac9cc83e6e5212c93ce5c8c236b71c4b481aa660ab2"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UsersModule-c9727de31eaf725f647f6f9fa1da0f0d8d5579e081b2831412acc211362d68f8de6228088c7ed00dcd400ac9cc83e6e5212c93ce5c8c236b71c4b481aa660ab2"' :
                                            'id="xs-controllers-links-module-UsersModule-c9727de31eaf725f647f6f9fa1da0f0d8d5579e081b2831412acc211362d68f8de6228088c7ed00dcd400ac9cc83e6e5212c93ce5c8c236b71c4b481aa660ab2"' }>
                                            <li class="link">
                                                <a href="controllers/UsersController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-UsersModule-c9727de31eaf725f647f6f9fa1da0f0d8d5579e081b2831412acc211362d68f8de6228088c7ed00dcd400ac9cc83e6e5212c93ce5c8c236b71c4b481aa660ab2"' : 'data-bs-target="#xs-injectables-links-module-UsersModule-c9727de31eaf725f647f6f9fa1da0f0d8d5579e081b2831412acc211362d68f8de6228088c7ed00dcd400ac9cc83e6e5212c93ce5c8c236b71c4b481aa660ab2"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UsersModule-c9727de31eaf725f647f6f9fa1da0f0d8d5579e081b2831412acc211362d68f8de6228088c7ed00dcd400ac9cc83e6e5212c93ce5c8c236b71c4b481aa660ab2"' :
                                        'id="xs-injectables-links-module-UsersModule-c9727de31eaf725f647f6f9fa1da0f0d8d5579e081b2831412acc211362d68f8de6228088c7ed00dcd400ac9cc83e6e5212c93ce5c8c236b71c4b481aa660ab2"' }>
                                        <li class="link">
                                            <a href="injectables/UsersService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#entities-links"' :
                                'data-bs-target="#xs-entities-links"' }>
                                <span class="icon ion-ios-apps"></span>
                                <span>Entities</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="entities-links"' : 'id="xs-entities-links"' }>
                                <li class="link">
                                    <a href="entities/Authentication.html" data-type="entity-link" >Authentication</a>
                                </li>
                                <li class="link">
                                    <a href="entities/User.html" data-type="entity-link" >User</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/CreateUserDto.html" data-type="entity-link" >CreateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/FindUserProvider.html" data-type="entity-link" >FindUserProvider</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginDTO.html" data-type="entity-link" >LoginDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/RegisterDTO.html" data-type="entity-link" >RegisterDTO</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserDto.html" data-type="entity-link" >UpdateUserDto</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/HashingProvider.html" data-type="entity-link" >HashingProvider</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#guards-links"' :
                            'data-bs-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AccessTokenGuard.html" data-type="entity-link" >AccessTokenGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/AuthenticationGuard.html" data-type="entity-link" >AuthenticationGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/ICacheManager.html" data-type="entity-link" >ICacheManager</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ITokenUser.html" data-type="entity-link" >ITokenUser</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});
