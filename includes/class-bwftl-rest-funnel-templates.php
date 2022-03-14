<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}


/**
 * Class BWFTL_REST_Funnel_Templates
 *
 * * @extends WP_REST_Controller
 */
if ( ! class_exists( 'BWFTL_REST_Funnel_Templates' ) ) {
	class BWFTL_REST_Funnel_Templates extends WP_REST_Controller {

		public static $_instance = null;

		/**
		 * Route base.
		 *
		 * @var string
		 */

		protected $namespace = 'woofunnel';
		protected $rest_base = 'templates';

		public function __construct() {
			add_action( 'rest_api_init', array( $this, 'register_routes' ) );
		}

		public static function get_instance() {
			if ( null === self::$_instance ) {
				self::$_instance = new self;
			}

			return self::$_instance;
		}

		/**
		 * Register the routes for taxes.
		 */
		public function register_routes() {

			register_rest_route( $this->namespace, '/' . $this->rest_base, array(
				array(
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => array( $this, 'get_templates' ),
					'permission_callback' => array( $this, 'get_api_permission_check' ),
					'args'                => []
				),
			) );
		}

		public function get_api_permission_check() {
			return true;
		}

		public function get_templates() {
			$resp = array();

			$resp['all_builder'] = array(
				'funnel'      => [
					'elementor' => 'Elementor',
					'divi'      => 'Divi',
					'gutenberg' => 'Gutenberg',
					'oxy'       => 'Oxygen',
					// 'wp_editor' => 'Other'
				],
				'landing'     => [
					'elementor' => 'Elementor',
					'divi'      => 'Divi',
					'gutenberg' => 'Gutenberg',
					'oxy'       => 'Oxygen',
					// 'wp_editor' => 'Other'
				],
				'optin'       => [
					'elementor' => 'Elementor',
					'divi'      => 'Divi',
					'gutenberg' => 'Gutenberg',
					'oxy'       => 'Oxygen',
					// 'wp_editor' => 'Other (Using Shortcodes)'
				],
				'wc_thankyou' => [
					'elementor' => 'Elementor',
					'divi'      => 'Divi',
					'gutenberg' => 'Gutenberg',
					'oxy'       => 'Oxygen',
					// 'wp_editor' => 'Other (Using Shortcodes)'
				],
				'wc_checkout' => [
					'elementor'  => 'Elementor',
					'divi'       => 'Divi',
					'gutenberg'  => 'Gutenberg',
					'oxy'        => 'Oxygen',
					'customizer' => 'Customizer', //pre_built
					// 'wp_editor'  => 'Other (Using Shortcodes)'
				],
				'upsell'      => [
					'elementor'  => 'Elementor',
					'divi'       => 'Divi',
					'gutenberg'  => 'Gutenberg',
					'oxy'        => 'Oxygen',
					'customizer' => 'Customizer',
					// 'wp_editor'  => 'Other (Using Shortcodes)'
				]
			);

			$resp['sub_filter_group'] = array(
				'funnel'      => [
					'all'   => 'All',
					'sales' => 'Sales Funnels',
					'optin' => 'Optin Funnels'
				],
				'landing'     => [
					'all' => 'All'
				],
				'optin'       => [
					'inline' => 'Inline',
					'popup'  => 'Popup'
				],
				'wc_thankyou' => [
					'all' => 'All'
				],
				'wc_checkout' => [
					'1' => 'One Step',
					'2' => 'Two Step',
					'3' => 'Three Step'
				],
				'upsell'      => [
					'all' => 'All'
				]
			);

			$resp['default_builder'] = 'elementor';

			if( class_exists( 'WooFunnels_Dashboard' ) ) {
				$templates = WooFunnels_Dashboard::get_all_templates();
				$json_data = isset( $templates['funnel'] ) ? $templates['funnel'] : [];
	
				if ( empty( $json_data ) ) {
					$templates = WooFunnels_Dashboard::get_all_templates( true );
					$json_data = isset( $templates['funnel'] ) ? $templates['funnel'] : [];
				}
			} else {
				$templates = get_option( '_bwf_fb_templates', [] );
				$json_data = isset( $templates['funnel'] ) ? $templates['funnel'] : [];
			}


			foreach ( $json_data as &$templates_nt ) {
				if ( is_array( $templates_nt ) ) {
					foreach ( $templates_nt as $k => &$temp_val ) {
						if ( isset( $temp_val['pro'] ) && 'yes' === $temp_val['pro'] ) {
							$temp_val['license_exist'] =  class_exists( 'WFFN_Core' ) ? WFFN_Core()->admin->get_license_status() : false;

							/**
							 * Check if template is set to replace lite template
							 * if yes and license exists then replace lite, otherwise keep lite and unset pro
							 */
							if ( isset( $temp_val['replace_to'] ) ) {
								if ( false === $temp_val['license_exist'] ) {
									unset( $templates_nt[ $k ] );
								} else {
									unset( $templates_nt[ $temp_val['replace_to'] ] );
								}
							}

						}
					}
				}
			}
			$templates['funnel'] = $json_data;
			if ( is_array( $templates ) && count( $templates ) > 0 ) {
				$resp['templates'] = apply_filters( 'bwftl_rest_get_templates', $templates );
			}

			return $resp;
		}

		public function sanitize_custom( $data ) {

			return json_decode( $data, true );
		}

	}


	if ( ! function_exists( 'BWFTL_rest_funnel_Templates' ) ) {

		function BWFTL_rest_funnel_Templates() {  //@codingStandardsIgnoreLine
			return BWFTL_REST_Funnel_Templates::get_instance();
		}
	}

	BWFTL_rest_funnel_Templates();
}
