var canAlert = true

function updateUI(element, value) {
	$(element).html(value)
}

function resetStats() {
	$('.data').each(function() {
		$(this).html('0.00')
	})

	$('#generation').html('0')
	$('#goal').html('Navigate track to completion.')
	$('#time-limit').html(15 + (5 * simulation.id) + ' seconds')
	$('#status').html('Not completed.')

	canAlert = true
}

$(document).ready(function() {
	$('#track-select').change(function() {
		simulation.changeTrack(Number($(this).val()))
		resetStats()

		$('#train-select').val('rand')
	})

	$('#train-select').change(function () {
		simulation.loadModel($('#train-select').val())
		resetStats()
	})

	$('#size-select').change(function () {
		simulation.changeGenerationSize(Number($(this).val()))
	})

	$('#mut-select').change(function () {
		simulation.changeMutationRate(Number($(this).val()))
	})
})


