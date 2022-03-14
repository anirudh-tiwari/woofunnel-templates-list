<?php
/**
 * Plugin Name: WooFunnels Template List
 * Plugin URI: https://buildwoofunnels.com/wordpress-funnel-builder/
 * Description: Add Woofunnel template list section by shortocde.
 * Version: 1.0.0
 * Author: BuildWooFunnels
 * Author URI: https://buildwoofunnels.com
 * License: GPLv3 or later
 * License URI: http://www.gnu.org/licenses/gpl-3.0.html
 * Text Domain: bwftl
 * Elementor tested up to: 3.5.0
 *
 * Requires at least: 5.4.0
 * Tested up to: 5.9.0
 * Requires PHP: 7.0
 * WooFunnels: true
 */


defined( 'ABSPATH' ) || exit; //Exit if accessed directly 

if ( ! class_exists( 'BWFTL' ) ) {
    class BWFTL {
        /**
		 * @var null
		 */
		public static $_instance = null;

        /**
		 * BWFTL constructor.
		 */
		public function __construct() {
			/**
			 * Load important variables and constants
			 */
			$this->define_plugin_properties();
			add_action( 'plugins_loaded', [ $this, 'bwftl_plugin_loaded' ] );

		}

		/**
		 * @return BWFTL|null
		 */
		public static function get_instance() {
			if ( null === self::$_instance ) {
				self::$_instance = new self;
			}

			return self::$_instance;
		}

        /**
		 * Defining constants
		 */
		public function define_plugin_properties() {
			define( 'BWFTL_VERSION', '1.0.0' );
			define( 'BWFTL_I18N', 'BWFTL' );
			define( 'BWFTL_PLUGIN_FILE', __FILE__ );
			define( 'BWFTL_PLUGIN_DIR', __DIR__ );
			define( 'BWFTL_PLUGIN_URL', untrailingslashit( plugin_dir_url( BWFTL_PLUGIN_FILE ) ) );
			define( 'BWFTL_PLUGIN_BASENAME', plugin_basename( __FILE__ ) );
			defined( 'BWFTL_REACT_DEV_URL' ) || define( 'BWFTL_REACT_DEV_URL',  BWFTL_PLUGIN_URL . 'dist' );
		}

        public function bwftl_plugin_loaded() {
            add_shortcode( 'woofunnel_templates_list', [$this, 'woofunnel_templates_list_func' ] );
        }

        public function woofunnel_templates_list_func() {
            $this->load_react_scripts();
            return '<div class="bwf-templates-list" id="bwf-templates-list">Hii</div>';
        }

        public function load_react_scripts() {
            $app_name      = 'bwf-templates';
            $script_handle = 'bwf-templates';
			$assets_dir    = BWFTL_REACT_DEV_URL;
			$assets_path   = $assets_dir . "/$app_name.asset.php";
			$assets        = file_exists( $assets_path ) ? include $assets_path : array(
				'dependencies' => array(
					'wp-element',
					'wp-i18n',
					'wp-api-request',
					'wp-components',
					'wp-blocks',
					'wp-editor',
					'wp-compose'
				),
				'version'      => BWFTL_VERSION,
			);

			$js_path    = "/$app_name.js";
			$style_path = "/$app_name.css";
			$deps       = ( isset( $assets['dependencies'] ) ? array_merge( $assets['dependencies'], array( 'jquery' ) ) : array( 'jquery' ) );
			$version    = $assets['version'];

			$script_deps = array_filter( $deps, function ( $dep ) {
				return false === strpos( $dep, 'css' );
			} );

			// wp_enqueue_style( 'wp-format-library' );
			// wp_enqueue_script( 'wp-format-library' );

			wp_enqueue_script( $script_handle, $assets_dir . $js_path, $script_deps, $version, true );
			wp_localize_script( $script_handle, 'bwftl', []);
            wp_enqueue_style( $script_handle, $assets_dir . $style_path, array(), $version );
			
			if ( function_exists( 'wp_set_script_translations' ) ) {
				wp_set_script_translations( "$script_handle-i18n", BWFTL_I18N );
			}
        }

    }
    return BWFTL::get_instance();
}