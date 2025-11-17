# Configure importmap to handle Sprockets errors gracefully
# This prevents errors when importmap tries to check if assets exist in Sprockets

Rails.application.config.after_initialize do
  # Add AssetNotPrecompiledError to rescuable errors
  # This allows importmap to gracefully handle cases where Sprockets finds
  # files in app/javascript but they aren't precompiled (because importmap serves them directly)
  if defined?(Sprockets::Rails::Helper::AssetNotPrecompiledError)
    Rails.application.config.importmap.rescuable_asset_errors << Sprockets::Rails::Helper::AssetNotPrecompiledError
  end
end
