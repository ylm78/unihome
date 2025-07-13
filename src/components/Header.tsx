@@ .. @@
             {/* User */}
             {loading ? (
-  <span className="text-sm text-gray-400">...</span>
-) : user ? (
-  <div className="flex flex-col items-end text-right">
-    <span className="text-sm text-amber-800">
-  {user?.firstName ? (
-    <>Vous êtes connecté en tant que <strong>{user.firstName}</strong></>
-  ) : (
-    <>Bienvenue</>
-  )}
-</span>
-
-    <button
-      onClick={logout}
-      className="text-sm text-blue-600 hover:underline mt-1"
-    >
-      Déconnexion
-    </button>
-  </div>
-) : (
-  <button
-    onClick={() => onNavigate('login')}
-    className="flex items-center px-4 py-2 text-sm font-medium text-amber-800 hover:text-amber-700 transition-colors bg-amber-50 rounded-lg hover:bg-amber-100"
-  >
-    <User className="w-4 h-4 mr-2" />
-    Connexion
-  </button>
-)}
+              <span className="text-sm text-gray-400">...</span>
+            ) : user ? (
+              <div className="flex flex-col items-end text-right">
+                <span className="text-sm text-amber-800 font-medium">
+                  {user?.firstName ? (
+                    <>Bienvenue <strong className="text-amber-900">{user.firstName}</strong></>
+                  ) : (
+                    <>Bienvenue</>
+                  )}
+                </span>
+                <button
+                  onClick={logout}
+                  className="text-sm text-blue-600 hover:text-blue-700 hover:underline mt-1 transition-colors"
+                >
+                  Déconnexion
+                </button>
+              </div>
+            ) : (
+              <button
+                onClick={() => onNavigate('login')}
+                className="flex items-center px-4 py-2 text-sm font-medium text-amber-800 hover:text-amber-700 transition-colors bg-amber-50 rounded-lg hover:bg-amber-100"
+              >
+                <User className="w-4 h-4 mr-2" />
+                Connexion
+              </button>
+            )}