var revolver = {

	results_limit: 10,

	user: 'jmhobbs',
	repo: 'revolver',
	name: 'Revolver',

	init:
		function ( config ) {
			revolver.user = config.user;
			revolver.repo = config.repo;
			revolver.name = config.name;

			$(
				function () {
					if( config.tab ) {
						tab = $( '<a href="#" class="revolver-tab"></a>' ).click( revolver.show );

						text_color = ( "undefined" == typeof( config.tab_text_color ) ) ? 'white' : config.tab_text_color;
						top = ( "undefined" == typeof( config.top ) ) ? '50%' : config.top;

						if( config.tab_side == 'right' ) {
							tab.addClass( 'revolver-right-tab' ).css( { 'top': top } );
							text_orientation = ( "undefined" == typeof( config.tab_text_orientation ) ) ? 'right' : config.tab_text_orientation;
						}
						else {
							tab.addClass( 'revolver-left-tab' ).css( { 'top': top } );
							text_orientation = ( "undefined" == typeof( config.tab_text_orientation ) ) ? 'left' : config.tab_text_orientation;
						}
					
						tab.addClass( 'revolver-tab-text-' + text_orientation + '-' + text_color );
						
						bgcolor = ( "undefined" == typeof( config.tab_color ) ) ? '#000' : config.tab_color;
						bordercolor = ( "undefined" == typeof( config.tab_border_color ) ) ? '#000' : config.tab_border_color;
						
						tab.css( { 'background-color': bgcolor, 'border-color': bordercolor } );

						$( "body" ).append( tab );
					}
				}
			);
		},

	show:
		function () {
			body = $( "body" );
			revolver.shadow = $( '<div id="revolver-shadow"><!--// shadow //--></div>' );
			revolver.container = $( '<div id="revolver-container"></div>' );
			revolver.box = $( '<div id="revolver-box"></div>' );
			
			revolver.box.append( $( '<span id="revolver-credits">Powered By <a href="http://github.com/jmhobbs/revolver">Revolver</a></span>' ) );
			
			revolver.box_search = $( '<input id="revolver-search" name="q" style="width: 410px;" type="text" />' );
			revolver.box_submit = $( '<input type="submit" style="width: 80px;" value="Search" />' ).click( revolver.search );
			revolver.box_results = $( '<ul id="revolver-results"></ul>' )
			
			revolver.box.append( $( '<h2>Search ' + revolver.name + ' Issues On GitHub</h2>' ) );
			revolver.box.append( $( '<form></form>' ).attr( 'action', 'http://github.com/' + revolver.user + '/' + revolver.repo + '/issuesearch' ).attr( 'method', 'GET' ).append( $( '<input type="hidden" name="state" value="open" />' ) ).append( revolver.box_search ).append( revolver.box_submit ) );
			revolver.box.append( $( '<hr/>' ) );
			revolver.box.append( revolver.box_results );

			revolver.shadow.css( { 'opacity': 0.75 } ).hide();
			revolver.box.hide();

			revolver.container.append( revolver.box )

			revolver.shadow.click( revolver.hide );

			body.append( revolver.container )
			body.append( revolver.shadow )

			revolver.shadow.fadeIn( 'fast', function () { revolver.box.fadeIn( 'fast' ); } );
		},

	search:
		function () {
			revolver.box_submit.attr( 'disabled', 'disabled' );
			revolver.box_search.attr( 'disabled', 'disabled' );

			value = revolver.box_search.val()
			if( '' == value ) {
				alert( 'You must search for something specific!' );
				revolver.box_submit.attr( 'disabled', '' );
				revolver.box_search.attr( 'disabled', '' ).focus();
				return;
			}
			
			revolver.box_results.empty();

			$.getJSON(
				"http://github.com/api/v2/json/issues/search/" + revolver.user + "/" + revolver.repo + "/open/" + escape( value ) + "/?callback=?",
				function ( data ) {
					for( i = 0; i < data.issues.length && i < revolver.results_limit; ++i ) {
						title = data.issues[i].title
						if( title.length > 38 )
							title = title.substr( 0, 35 ) + "...";
						revolver.box_results.append( $( '<li><a href="http://github.com/' + revolver.user + '/' + revolver.repo + '/issues#issue/' + data.issues[i].number + '">' + title + '</a></li>' ) );
					}
					if( data.issues.length > revolver.results_limit )
						revolver.box_results.append( $( '<li><a href="http://github.com/' + revolver.user + '/' + revolver.repo + '/issues"><b>And ' + ( data.issues.length - revolver.results_limit ) + ' More...</a>' ) );
					revolver.box_submit.attr( 'disabled', '' );
					revolver.box_search.attr( 'disabled', '' );
				}
			);
		
			return false;
		},

	hide:
		function () {
			revolver.box.fadeOut(
				'fast',
				function () {
					revolver.shadow.fadeOut(
						'fast',
						function () { revolver.shadow.remove(); }
					);
					revolver.box.remove();
					revolver.container.remove();
				}
			);
		},
}
