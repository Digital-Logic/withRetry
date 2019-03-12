if (!Object.entries) {
    Object.entries = function( obj ){
        var ownProps = Object.keys( obj ),
            i = ownProps.length,
            resArray = new Array(i); // preallocate the Array
        while (i--)
            resArray[i] = [ownProps[i], obj[ownProps[i]]];

        return resArray;
    };
}

if (!Object.values) {
    Object.values = function ( obj ){
        var keys = Object.keys( obj );
        var values = [];
        for (var i=0; i<keys.length; ++i)
            values[i] = obj[keys[i]];

        return values;
    };
}