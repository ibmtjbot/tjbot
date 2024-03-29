export default {
  robotName: 'Watson', // set this to the name you wish to use to address your tjbot!
  endpoint: '',
  project_id: '',
  model_id: 'ibm/granite-13b-chat-v2',
  version: '2023-05-29',
  parameters: {
    decoding_method: 'greedy',
    max_new_tokens: 20,
    min_new_tokens: 0,
    stop_sequences: [],
    repetition_penalty: 1
  }
};