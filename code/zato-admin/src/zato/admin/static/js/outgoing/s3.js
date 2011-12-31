
// /////////////////////////////////////////////////////////////////////////////

$.fn.zato.data_table.S3 = new Class({
    toString: function() {
        var s = '<S3 id:{0} name:{1} is_active:{2}';
        return String.format(s, this.id ? this.id : '(none)',
                                this.name ? this.name : '(none)',
                                this.is_active ? this.is_active : '(none)');
    }
});

// /////////////////////////////////////////////////////////////////////////////

$(document).ready(function() {
    $('#data-table').tablesorter();
    $.fn.zato.data_table.class_ = $.fn.zato.data_table.S3;
    $.fn.zato.data_table.new_row_func = $.fn.zato.outgoing.s3.data_table.new_row;
    $.fn.zato.data_table.parse();
    $.fn.zato.data_table.setup_forms(['name', 'prefix', 'aws_access_key', 'separator', 'key_sync_timeout']);
})

$.fn.zato.outgoing.s3.create = function() {
    $.fn.zato.data_table._create_edit('create', 'Create a new outgoing S3 connection', null);
}

$.fn.zato.outgoing.s3.edit = function(id) {
    $.fn.zato.data_table._create_edit('edit', 'Update the outgoing S3 connection', id);
}

$.fn.zato.outgoing.s3.data_table.new_row = function(item, data, include_tr) {
    var row = '';

    if(include_tr) {
        row += String.format("<tr id='tr_{0}' class='updated'>", item.id);
    }

    var is_active = item.is_active == true;

    row += "<td class='numbering'>&nbsp;</td>";
    row += "<td><input type='checkbox' /></td>";
    row += String.format('<td>{0}</td>', item.name);
    row += String.format('<td>{0}</td>', is_active ? 'Yes' : 'No');
    row += String.format('<td>{0}</td>', item.prefix);
    row += String.format('<td>{0}</td>', item.aws_access_key);
    row += String.format('<td>{0}</td>', item.separator);
    row += String.format('<td>{0}</td>', item.key_sync_timeout);
    row += String.format('<td>{0}</td>', String.format("<a href=\"javascript:$.fn.zato.data_table.change_password('{0}')\">Change secret key</a>", item.id));
    row += String.format('<td>{0}</td>', String.format("<a href=\"javascript:$.fn.zato.outgoing.s3.edit('{0}')\">Edit</a>", item.id));
    row += String.format('<td>{0}</td>', String.format("<a href='javascript:$.fn.zato.outgoing.s3.delete_({0});'>Delete</a>", item.id));
    row += String.format("<td class='ignore item_id_{0}'>{0}</td>", item.id);
    row += String.format("<td class='ignore'>{0}</td>", is_active);

    if(include_tr) {
        row += '</tr>';
    }

    return row;
}

$.fn.zato.outgoing.s3.delete_ = function(id) {
    $.fn.zato.data_table.delete_(id, 'td.item_id_',
        'Outgoing S3 connection [{0}] deleted',
        'Are you sure you want to delete the outgoing S3 connection [{0}]?',
        true);
}
