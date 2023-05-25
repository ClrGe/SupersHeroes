<script lang="ts">
	import loginOffice from '$lib/templates/Admin/Images/login-office.jpeg'
	import loginOfficeDark from '$lib/templates/Admin/Images/login-office-dark.jpeg'
	import ToggleTheme from '$src/lib/templates/Admin/ToggleTheme.svelte'
</script>

<section id="body">
	<div class="flex items-center mt-12  bg-gray-50 dark:bg-gray-900">
		<div class="flex-1 mx-auto">
			<div
				class="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800"
			>
				<div class="flex flex-col overflow-y-auto md:flex-row">
					<div class="h-32 md:h-auto md:w-1/2">
						<img
							aria-hidden="true"
							class="object-cover w-full h-full dark:hidden"
							src="https://i.postimg.cc/9McWW0Yz/41226.jpg"
							alt="Office"
						/>
						<img
							aria-hidden="true"
							class="hidden object-cover w-full h-full dark:block"
							src="https://i.postimg.cc/9McWW0Yz/41226.jpg"
							alt="Office"
						/>
					</div>
					<div class="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
						<div class="w-full">
							<form method="post" action="?/login">
								<label class="block text-sm">
									<span class="text-gray-700 dark:text-gray-400">Email</span>
									<input
										name="email"
										type="email"
										class="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
										placeholder="theodore.cobblepot@gotham.dc"
									/>
								</label>
								<label class="block mt-4 text-sm">
									<span class="text-gray-700 dark:text-gray-400">Mot de passe</span>
									<input
										name="password"
										class="block w-full mt-1 text-sm dark:border-gray-600 dark:bg-gray-700 focus:border-purple-400 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input"
										placeholder="***************"
										type="password"
									/>
								</label>

								<!-- You should use a button here, as the anchor is only used for the example  -->
								<button
									type="submit"
									class="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-red-600 border border-transparent rounded-lg active:bg-red-600 hover:bg-red-700 focus:outline-none focus:shadow-outline-purple"
								>
									Connexion
								</button>
							</form>

							<hr class="my-8" />

							<p class="mt-4">
								<a
									class="text-sm font-medium text-red-600 dark:text-purple-400 hover:underline"
									href="./forgot-password.html"
								>
									Mot de passe oublié ?
								</a>
							</p>
							<p class="mt-1">
								<a
									class="text-sm font-medium text-gray-600 dark:text-purple-400 underline"
									href="./create-account.html"
								>
									Créer un compte ville - partenaire
								</a>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
