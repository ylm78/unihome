@@ .. @@
   const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setErrors([]);
 
     try {
       if (isLogin) {
         const success = await login(formData.email, formData.password);
-        console.log("Tentative de connexion :", formData.email);
         if (success) {
+          toast.success("Connexion réussie !");
           onNavigate('home');
         } else {
           setErrors(['Email ou mot de passe incorrect']);
         }
       } else {
         if (formData.password !== formData.confirmPassword) {
           setErrors(['Les mots de passe ne correspondent pas']);
           return;
         }
         const success = await register({
           email: formData.email,
           password: formData.password,
           firstName: formData.firstName,
           lastName: formData.lastName,
           phone: formData.phone,
         });
         if (success) {
-          toast.success("Bienvenue !");
+          toast.success("Inscription réussie ! Bienvenue !");
           onNavigate('home');
         } else {
           setErrors(['Erreur lors de l\'inscription']);
         }
       }
     } catch (error: any) {
-  setErrors([error.message || 'Une erreur est survenue']);
-}
+      setErrors([error.message || 'Une erreur est survenue']);
+    }
   };