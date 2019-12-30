function updateUI(element, value) {
	$(element).html(value)
}

function resetStats() {
	$('.data').each(function() {
		$(this).html('0.00')
	})

	$('#generation').html('0')
	$('#goal').html('Navigate track to completion.')
	$('#time-limit').html('10 seconds')
	$('#status').html('Not completed.')
}

$(document).ready(function() {
	$('#track-select').change(function() {
		simulation.changeTrack(Number($(this).val()))
		resetStats()
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


