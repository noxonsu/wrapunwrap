const PromiseChunksCall = (options) => {
  const {
    args,
    chunkSize,
    func,
    onFetching,
  } = {
    chunkSize: 100,
    onFetching: (cursorPos, total) => {},
    ...options
  }
  

  return new Promise(async (resolve, reject) => {
    const ret = []
    for (let i = 0; i < args.length; i += chunkSize) {
      try {
        
        const chunk = args.slice(i, i + chunkSize);
        const chunkResult = await func(chunk)
        ret.push(...chunkResult)
        onFetching(i, args.length)
      } catch (err) {
        reject(err)
      }
    }
    resolve(ret)
  })
}

export default PromiseChunksCall