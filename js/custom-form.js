var customForm = {
    init: function () {
        $('.field-validate.field-tag, .field-required.field-tag').on('blur change', function () {
            customForm.fieldValidate($(this));
        });
        $('.field-validate.field-tag').on('focus', function () {
            customForm.fieldDesc($(this));
        });
        $('.field-tag.select-field').off('click').on('click', function (e) {
            customForm.materialSelectField($(this));
        });
        $('.field-tag.select-field').off('keypress', function (e) {
            e.preventDefault();
        });
        $('.field-tag.radio-field').off('click').on('click', function (e) {
            customForm.materialRadioField($(this));
        });
        $('.select-field-set.default-select').each(function (index, value) {
            var $thisInputField = $(value).find('input');
            $thisDataListID = $thisInputField.attr('data-list'),
                $thisOrginalFieldID = $thisInputField.attr('data-orginalField'),
                $thisDataListValue = $('#' + $thisDataListID).find('option:selected').val() || $('#' + $thisDataListID).find('option:first').val(),
                $thisDataListText = $('#' + $thisDataListID).find('option:selected').text() || $('#' + $thisDataListID).find('option:first').text();
            $thisInputField.val($thisDataListValue);
            $('#' + $thisOrginalFieldID + ' option:first-child').val($thisDataListValue);
            $('#' + $thisOrginalFieldID + ' option:first-child').html($thisDataListText);
            $(value).find('.field-additional-label').html($thisDataListText);
        });
    },
    fieldValidate: function ($this) {
        var $thisTag = $this,
            $thisID = $this.attr('id'),
            $thisName = $this.attr('name'),
            $thisType = $this.attr('type'),
            $thisVal = ($thisType == 'checkbox' || $thisType == 'radio') ? $('input[name$="' + $thisName + '"]:checked').val() : $this.val(),
            $thisFieldPattern = $this.attr('data-pattern'),
            $thisPattern = '^(' + $thisFieldPattern + ')$',
            $thisPatternRemove = '/' + $thisFieldPattern + '/gm',
            $thisParent = $this.parents('.field-set'),
            $thisHelper = $thisParent.find('.field-helper'),
            $thisPatternValidate = $this.hasClass('field-validate'),
            $thisRequired = $this.hasClass('field-required');
        if (!$thisTag.is(':visible')) {
            return false;
        }
        if ($thisRequired == true && ($thisVal == "" || $thisVal === undefined)) {
            if ($thisType == 'checkbox' || $thisType == 'radio') {
                $thisParent.addClass('validation-error');
                $thisParent.removeClass('validation-success');
                return false;
            }
            $thisHelper.html("Required");
            $thisParent.addClass('validation-error');
            $thisParent.removeClass('validation-success');
            return false;
        } else {
            $thisHelper.html("");
            $thisParent.addClass('validation-success');
            $thisParent.removeClass('validation-error');
        }
        if ($thisType == 'checkbox' || $thisType == 'radio' || $thisType == 'file' || $thisType == 'select' || $thisType == 'submit') {
            return false;
        }
        if ($thisVal.substring(0, 1) == " ") {
            $thisHelper.html("First letter should not be space");
            $thisParent.addClass('validation-error');
            $thisParent.removeClass('validation-success');
            return false;
        } else {
            $thisHelper.html("");
            $thisParent.addClass('validation-success');
            $thisParent.removeClass('validation-error');
        }
        if ($thisVal.length <= 0) {
            return false;
        }
        if ($thisPatternValidate != true) {
            return false;
        }
        if (($thisPattern != "" && $thisPattern != undefined)) {
            if (!$thisVal.match($thisPattern)) {
                var valueToRemove = $thisVal.replace(eval($thisPatternRemove), ''),
                    errorMessage = "Need to match requirment";
                if (valueToRemove != "") {
                    if ($thisID.toUpperCase().indexOf("MAIL") < 0) {
                        errorMessage += "<span class='to-remove-text' data-fieldId='" + $thisID + "' data-fieldPattern='" + $thisFieldPattern + "'>Remove:&nbsp;<span class='remove-text'>" + valueToRemove + "</span></span>";
                    } else {
                        errorMessage += "<span class='to-remove-suggestion'>&nbsp;Remove:&nbsp;<span class='remove-text'>" + valueToRemove + "</span></span>";
                    }
                }
                $thisHelper.html(errorMessage);
                customForm.fieldRemoveText();
                $thisParent.addClass('validation-error');
                $thisParent.removeClass('validation-success');
                return false;
            } else {
                $thisHelper.html("");
                $thisParent.addClass('validation-success');
                $thisParent.removeClass('validation-error');
            }
        }
    },
    formValidate: function ($this) {
        $this.find('.field-validate.field-tag, .field-required.field-tag').each(function (index, field) {
            customForm.fieldValidate($(field));
        });
    },
    valid: function ($this) {
        customForm.formValidate($this);
        return ($this.find('.validation-error').length <= 0) ? true : false;
    },
    fieldRemoveText: function () {
        $('.field-set .field-helper .to-remove-text').off('click').on('click', function () {
            var $thisTag = $(this),
                $thisFieldID = $thisTag.attr('data-fieldId'),
                $thisFieldPattern = $thisTag.attr('data-fieldPattern'),
                $thisFieldValue = $('#' + $thisFieldID).val(),
                fieldPatternSubString0 = $thisFieldPattern.substr(0, 1),
                fieldPatternSubStringNon0 = $thisFieldPattern.substr(1),
                fieldPatternIndex = $thisFieldPattern.lastIndexOf("{"),
                fieldPatternSubStringNon0 = fieldPatternSubStringNon0.substr(0, fieldPatternIndex - 1),
                $thisPatternReplace = '/' + fieldPatternSubString0 + '^' + fieldPatternSubStringNon0 + '/gm',
                valueToReplace = $thisFieldValue.replace(eval($thisPatternReplace), '');
            $('#' + $thisFieldID).val(valueToReplace);
            $('#' + $thisFieldID).trigger('blur');
        });
    },
    fieldDesc: function ($this) {
        var $thisTag = $this,
            $thisType = $this.attr('type'),
            $thisPatternDesc = $this.attr('data-patternDesc'),
            $thisParent = $this.parents('.field-set'),
            $thisHelper = $thisParent.find('.field-helper');
        if ($thisType == 'checkbox' || $thisType == 'radio') {
            return false;
        }
        if ($thisPatternDesc != "" && $thisPatternDesc != undefined) {
            $thisHelper.html($thisPatternDesc);
            $thisHelper.show();
        }
    },
    materialSelectField: function ($this) {
        var $thisTag = $this,
            $thisID = $this.attr('id'),
            $thisVal = $this.val(),
            $thisDataList = $this.attr('data-list'),
            $thisOriginalField = $this.attr('data-orginalField'),
            $thisParent = $this.parents('.field-set'),
            $thisParentForm = $this.parents('form'),
            $thisHelper = $thisParent.find('.field-helper');
        $('#' + $thisDataList).css({ 'display': 'inline-block' });
        $thisParentForm.css({ 'position': 'relative' });
		$thisParent.addClass('dropdown-open-'+$thisID);
		$thisTag.addClass('dropdown-open-'+$thisID);

        $('#' + $thisDataList + ' option').on('click', function () {
            var $thisOptionValue = $(this).val(),
                $thisOptionText = $(this).text();
            $this.val($thisOptionValue);
            if ($thisOptionValue == "" || $thisOptionValue == "null") {
                $thisParent.find('.field-additional-label').html("");
                $('#' + $thisID).val("");
                $('#' + $thisDataList + ' option:selected').prop('selected', false);
            } else {
                $thisParent.find('.field-additional-label').html($thisOptionText);
                $('#' + $thisID).val($thisOptionValue);
                $('#' + $thisDataList + ' option:selected').prop('selected', false);
                $(this).prop('selected', true);
            }
            $thisParent.find('#' + $thisOriginalField + ' option:first-child').val($thisOptionValue);
            $thisParent.find('#' + $thisOriginalField + ' option:first-child').html($thisOptionText);

            $('#' + $thisOriginalField).trigger('change');
            $('#' + $thisDataList).css({ 'display': 'none' });
            $thisParentForm.css({ 'position': 'unset' });
            customForm.fieldValidate($thisTag);
            $('body').unbind('click.mynamespace');
            $('body').unbind('keypress.mynamespace');
        });
        setTimeout(function () {
            $('body').on('click.mynamespace keypress.mynamespace', function (e) {
                //e.preventDefault();
				if($(e.target).hasClass('dropdown-open-'+$thisID)){
					return false;
				}
                $('#' + $thisDataList).css({ 'display': 'none' });
                $thisParentForm.css({ 'position': 'unset' });
                $('body').unbind('click.mynamespace');
                $('body').unbind('keypress.mynamespace');
                $('html').trigger('click');
                $thisTag.trigger('blur');
				$thisParent.removeClass('dropdown-open-'+$thisID);
				$thisTag.removeClass('dropdown-open-'+$thisID);
            });
        }, 300);
    },
    materialRadioField: function ($this) {
        var $thisTag = $this,
            $thisID = $this.attr('id'),
            $thisVal = $this.val(),
            $thisName = $this.attr('name'),
            $thisParent = $this.parents('.field-set'),
            $thisParentForm = $this.parents('form'),
            $thisHelper = $thisParent.find('.field-helper'),
            $thisVal_ = $this.attr('data-value'),
            fieldValue = "";
        $('.field-tag.radio-field[name$="' + $thisName + '"]').each(function (index, value) {
            fieldValue = $(value).val();
            if (fieldValue != "") {
                $(value).attr('data-value', fieldValue);
                $(value).val("");
            }
        });
        $this.val($thisVal_);
    }
};
